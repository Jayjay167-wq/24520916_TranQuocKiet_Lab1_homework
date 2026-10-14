const EVENT_START_ISO = "2026-12-01T09:00:00Z";

const formatRemainingTime = (remainingMilliseconds) => {
  const totalSeconds = Math.ceil(remainingMilliseconds / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return `${days} days, ${hours} hours, ${minutes} minutes, and ${seconds} seconds remaining.`;
};

export const startCountdown = ({
  targetDate = EVENT_START_ISO,
  statusElement = document.querySelector("#countdown-status"),
  clock = Date.now,
  timerApi = window,
} = {}) => {
  let timerId = null;
  const targetTime = Date.parse(targetDate);

  const stopCountdown = () => {
    if (timerId !== null) {
      timerApi.clearInterval(timerId);
      timerId = null;
    }
  };

  if (!statusElement) {
    return stopCountdown;
  }

  if (!Number.isFinite(targetTime)) {
    statusElement.textContent = "Countdown unavailable: the event time is invalid.";
    return stopCountdown;
  }

  const updateCountdown = () => {
    const remainingMilliseconds = targetTime - clock();

    if (remainingMilliseconds <= 0) {
      statusElement.textContent = "The event has started.";
      stopCountdown();
      return;
    }

    statusElement.textContent = formatRemainingTime(remainingMilliseconds);
  };

  updateCountdown();

  if (targetTime > clock()) {
    timerId = timerApi.setInterval(updateCountdown, 1000);
  }

  return stopCountdown;
};

const sanitizeText = (value) => value
  .replace(/[<>]/g, "")
  .replace(/\s+/g, " ")
  .trim();

export const initializeRegistrationForm = ({
  form = document.querySelector("#registration-form"),
  statusElement = document.querySelector("#form-status"),
  timerApi = window,
} = {}) => {
  const submitButton = form?.querySelector("button[type='submit']");

  if (!form || !statusElement || !submitButton) {
    return { destroy: () => {}, getState: () => "idle" };
  }

  const transitions = {
    idle: ["submitting", "error"],
    submitting: ["success", "error"],
    success: ["idle"],
    error: ["idle"],
  };
  let state = "idle";
  let submissionTimer = null;

  const setState = (nextState, message) => {
    if (!transitions[state].includes(nextState)) {
      return false;
    }

    state = nextState;
    const isSubmitting = state === "submitting";

    submitButton.disabled = isSubmitting;
    form.setAttribute("aria-busy", String(isSubmitting));
    statusElement.textContent = message;
    return true;
  };

  const resetToIdle = () => {
    if (state === "success" || state === "error") {
      setState("idle", "Complete the form to register your interest.");
    }
  };

  const handleInvalid = () => {
    if (state === "idle") {
      setState("error", "Please correct the highlighted fields before submitting.");
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (state !== "idle") {
      return;
    }

    if (!form.checkValidity()) {
      form.reportValidity();
      handleInvalid();
      return;
    }

    const formData = new FormData(form);
    const submission = {
      email: sanitizeText(String(formData.get("email") ?? "")).toLowerCase(),
      message: sanitizeText(String(formData.get("message") ?? "")),
      name: sanitizeText(String(formData.get("name") ?? "")),
    };

    if (!setState("submitting", "Submitting your registration.")) {
      return;
    }

    submissionTimer = timerApi.setTimeout(() => {
      submissionTimer = null;

      if (!submission.name || !submission.email || !submission.message) {
        setState("error", "Registration could not be completed. Please review your details.");
        return;
      }

      setState("success", `Registration received for ${submission.name}.`);
    }, 250);
  };

  form.addEventListener("input", resetToIdle);
  form.addEventListener("invalid", handleInvalid, true);
  form.addEventListener("submit", handleSubmit);

  return {
    destroy: () => {
      if (submissionTimer !== null) {
        timerApi.clearTimeout(submissionTimer);
      }

      form.removeEventListener("input", resetToIdle);
      form.removeEventListener("invalid", handleInvalid, true);
      form.removeEventListener("submit", handleSubmit);
    },
    getState: () => state,
  };
};

startCountdown();
initializeRegistrationForm();
