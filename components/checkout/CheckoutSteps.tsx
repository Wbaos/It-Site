import SvgIcon from "@/components/common/SvgIcons";
import { Calendar, CreditCard, MapPin, User } from "lucide-react";

const styles = new Proxy({} as Record<string, string>, {
  get: (_target, prop) => (typeof prop === "string" ? prop : ""),
});

interface CheckoutStepsProps {
  currentStep: 1 | 2 | 3 | 4;
  locale?: "en" | "es";
}

export default function CheckoutSteps({ currentStep, locale = "en" }: CheckoutStepsProps) {
  const steps = [
    { number: 1, label: locale === "es" ? "Contacto" : "Contact", icon: <User size={16} /> },
    { number: 2, label: locale === "es" ? "Dirección" : "Address", icon: <MapPin size={16} /> },
    { number: 3, label: locale === "es" ? "Programar" : "Schedule", icon: <Calendar size={16} /> },
    { number: 4, label: locale === "es" ? "Confirmar" : "Confirm", icon: <CreditCard size={16} /> },
  ];

  return (
    <div className="checkoutSteps">
      <div className={styles.stepsBar}>
        <div className={styles.steps}>
          {steps.map((step, index) => (
            <div key={step.number} className={styles.stepWrapper}>
              <div className={styles.stepItem}>
                <div
                  className={`${styles.circle} ${
                    step.number === currentStep
                      ? styles.active
                      : step.number < currentStep
                      ? styles.completed
                      : styles.pending
                  }`}
                >
                  {step.number < currentStep ? (
                    <SvgIcon name="check" size={16} />
                  ) : (
                    step.icon
                  )}
                </div>
                <span
                  className={`${styles.label} ${
                    step.number === currentStep
                      ? styles.labelActive
                      : step.number < currentStep
                      ? styles.labelCompleted
                      : ""
                  }`}
                >
                  {step.label}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`${styles.line} ${
                    step.number < currentStep
                      ? styles.lineCompleted
                      : styles.linePending
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
