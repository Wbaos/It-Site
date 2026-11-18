"use client";

import { useState } from "react";
import Link from "next/link";
import { serviceHref } from "@/lib/serviceTwins";

// Interactive diagnostic that replaces the old rotating Highlights
// strip: "What's wrong with your system?" — six symptoms as buttons.
// Tapping one animates to a result card with the likely cause, a link
// to the service that fixes it, and a free-inspection CTA to the form.
// Every cause below is grounded in what the linked service page
// already says — nothing invented. Hard rules hold: pumps and timers
// are installation/replacement/programming only, never "repair"; no
// prices; "free inspection", never "free estimate"; no 24/7.
type Symptom = {
  id: string;
  labelEn: string;
  labelEs: string;
  causeEn: string;
  causeEs: string;
  serviceSlug: string;
  serviceEn: string;
  serviceEs: string;
};

const SYMPTOMS: Symptom[] = [
  {
    id: "dry-spots",
    labelEn: "Dry spots",
    labelEs: "Partes secas del césped",
    causeEn:
      "Most often a clogged or broken head, or a zone with low pressure. We test the water pressure and check each zone to find the cause.",
    causeEs:
      "Casi siempre es un cabezal tapado o roto, o una zona con baja presión. Revisamos la presión del agua y cada zona para encontrar la causa.",
    serviceSlug: "sprinkler-repair-and-installation",
    serviceEn: "Sprinkler Repair",
    serviceEs: "Reparación de Sprinklers",
  },
  {
    id: "leak",
    labelEn: "Pooling water or leak",
    labelEs: "Charcos o fuga",
    causeEn:
      "Usually a broken pipe or a leaking fitting underground. We find the leak, replace the damaged pipe or fitting, and test the zone before we leave.",
    causeEs:
      "Casi siempre es una tubería rota o una conexión con fuga bajo tierra. Encontramos la fuga, reemplazamos la tubería o conexión dañada y probamos la zona antes de irnos.",
    serviceSlug: "sprinkler-leak-repair",
    serviceEn: "Sprinkler Leak Repair",
    serviceEs: "Reparación de Fugas de Sprinklers",
  },
  {
    id: "heads-pressure",
    labelEn: "Heads won't pop up or low pressure",
    labelEs: "Cabezales que no salen o poca presión",
    causeEn:
      "Often a bad valve: low pressure in one zone, or heads that barely pop up while the rest of the system works fine. We test the valve and the solenoid to find the real cause.",
    causeEs:
      "Muchas veces es una válvula mala: baja presión en una zona, o cabezales que apenas salen mientras el resto del sistema trabaja bien. Probamos la válvula y el solenoide para encontrar la causa real.",
    serviceSlug: "sprinkler-valve-repair",
    serviceEn: "Sprinkler Valve Repair",
    serviceEs: "Reparación de Válvulas de Sprinklers",
  },
  {
    id: "pump",
    labelEn: "Pump won't prime",
    labelEs: "La bomba no arranca o no sube agua",
    causeEn:
      "It can be the pump, the timer, the relay, the wiring, or a bad check valve — we check each one during the free inspection. We install a new pump only; we do not repair pumps.",
    causeEs:
      "Puede ser la bomba, el temporizador, el relé, el cableado o una válvula de retención mala, y revisamos cada una durante la inspección gratis. Instalamos una bomba nueva solamente; no reparamos bombas.",
    serviceSlug: "sprinkler-pump-replacement",
    serviceEn: "Sprinkler Pump Replacement",
    serviceEs: "Reemplazo de Bombas de Sprinklers",
  },
  {
    id: "timer",
    labelEn: "Timer or controller not working",
    labelEs: "El timer o controlador no funciona",
    causeEn:
      "Usually the old controller no longer works. We remove it, install a new digital controller, and program your watering schedule for every zone.",
    causeEs:
      "Casi siempre el controlador viejo ya no sirve. Lo retiramos, instalamos un controlador digital nuevo y programamos tu horario de riego para cada zona.",
    serviceSlug: "sprinkler-timer-installation",
    serviceEn: "Sprinkler Timer Installation",
    serviceEs: "Instalación de Temporizadores de Sprinklers",
  },
  {
    id: "new-system",
    labelEn: "I want a new system",
    labelEs: "Quiero un sistema nuevo",
    causeEn:
      "We design the system around your property, install pipes, heads, valves and controller, and test every zone before we hand it over.",
    causeEs:
      "Diseñamos el sistema según tu propiedad, instalamos tuberías, cabezales, válvulas y controlador, y probamos cada zona antes de entregarlo.",
    serviceSlug: "new-irrigation-installation",
    serviceEn: "New Irrigation Installation",
    serviceEs: "Instalación Nueva de Irrigación",
  },
];

export default function SystemDiagnostic({ locale = "en" }: { locale?: "en" | "es" }) {
  const isSpanish = locale === "es";
  const [selected, setSelected] = useState<number | null>(null);
  const symptom = selected === null ? null : SYMPTOMS[selected];

  return (
    <section className="heritage-diagnostic" aria-labelledby="diagnostic-title">
      <div className="heritage-diag-inner">
        <h2 id="diagnostic-title" className="heritage-diag-title">
          {isSpanish ? "¿Qué le pasa a tu sistema?" : "What's wrong with your system?"}
        </h2>
        <p className="heritage-diag-sub">
          {isSpanish
            ? "Toca un síntoma para ver la causa probable."
            : "Tap a symptom to see the likely cause."}
        </p>

        {symptom === null ? (
          <div key="question" className="heritage-diag-view">
            <div className="heritage-diag-grid" role="group" aria-label={isSpanish ? "Síntomas" : "Symptoms"}>
              {SYMPTOMS.map((s, i) => (
                <button
                  key={s.id}
                  type="button"
                  className="heritage-diag-btn"
                  onClick={() => setSelected(i)}
                >
                  {isSpanish ? s.labelEs : s.labelEn}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div key={`result-${symptom.id}`} className="heritage-diag-view">
            <div className="heritage-diag-result">
              <p className="heritage-diag-result-label">
                {isSpanish ? "Causa probable" : "Likely cause"}
              </p>
              <p className="heritage-diag-cause">
                {isSpanish ? symptom.causeEs : symptom.causeEn}
              </p>
              <p className="heritage-diag-service">
                <Link href={serviceHref(symptom.serviceSlug, locale)}>
                  {isSpanish ? symptom.serviceEs : symptom.serviceEn} →
                </Link>
              </p>
              <div className="heritage-diag-ctas">
                <a href="#quick-lead" className="heritage-diag-cta">
                  {isSpanish ? "Reserva tu inspección gratis" : "Get your free inspection"}
                </a>
                <button
                  type="button"
                  className="heritage-diag-back"
                  onClick={() => setSelected(null)}
                >
                  ← {isSpanish ? "Elegir otro síntoma" : "Choose another symptom"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
