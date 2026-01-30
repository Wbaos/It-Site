"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import SvgIcon from "@/components/common/SvgIcons";
import RequestQuoteSidebar from "@/components/request-quote/RequestQuoteSidebar";
import RequestQuoteThankYou from "@/components/request-quote/RequestQuoteThankYou";
import Step1ServiceSelection from "@/components/request-quote/steps/Step1ServiceSelection";
import Step2ContactInfo from "@/components/request-quote/steps/Step2ContactInfo";
import Step3Location from "@/components/request-quote/steps/Step3Location";
import Step4AdditionalDetails from "@/components/request-quote/steps/Step4AdditionalDetails";
import type {
  ApiCategory,
  RequestQuoteContent,
} from "@/lib/request-quote-data";
import type {
  SelectableService,
  SelectedService,
  UrgencyOption,
  UrgencyOptionId,
} from "@/components/request-quote/types";

const steps = [
  {
    title: "Submit Your Request",
    desc: "Fill out the form with your service needs and preferred schedule.",
  },
  {
    title: "Receive Your Quote",
    desc: "We’ll review your request and send a detailed quote within 2-4 hours.",
  },
  {
    title: "Schedule Service",
    desc: "Once you approve, we’ll confirm your appointment with a certified technician.",
  },
  {
    title: "Get It Done",
    desc: "Our expert arrives on time and completes the job to your satisfaction.",
  },
];

const urgencyOptions: readonly UrgencyOption[] = [
  { id: "within-week", label: "Within a week" },
  { id: "2-3-days", label: "In 2-3 days" },
  { id: "asap", label: "ASAP" },
];

export default function RequestQuoteClient(props: {
  initialCategories: ApiCategory[];
  initialRqContent: RequestQuoteContent | null;
  initialTab: string;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const stepSectionRef = useRef<HTMLDivElement | null>(null);
  const didMountRef = useRef(false);

  const thankYouTopRef = useRef<HTMLDivElement | null>(null);

  const tabContainerRef = useRef<HTMLDivElement | null>(null);
  const tabScrollSaveRaf = useRef<number | null>(null);

  const categories = props.initialCategories;
  const rqContent = props.initialRqContent;

  const [activeTab, setActiveTab] = useState<string>(props.initialTab || categories?.[0]?.categorySlug || "all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedService, setSelectedService] = useState<SelectedService | null>(null);

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  const [contactFirstName, setContactFirstName] = useState("");
  const [contactLastName, setContactLastName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");

  const [streetAddress, setStreetAddress] = useState("");
  const [city, setCity] = useState("");
  const [zipCode, setZipCode] = useState("");

  const [projectDetails, setProjectDetails] = useState("");
  const [wantsTechnicianVisitFirst, setWantsTechnicianVisitFirst] = useState(false);
  const [preferredDate, setPreferredDate] = useState("");
  const [preferredTime, setPreferredTime] = useState("");
  const [heardAbout, setHeardAbout] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [showThankYou, setShowThankYou] = useState(false);
  const [referenceNumber, setReferenceNumber] = useState<string>("");

  useEffect(() => {
    if (!didMountRef.current) {
      didMountRef.current = true;
      return;
    }

    if (showThankYou) return;

    stepSectionRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, [step, showThankYou]);

  useEffect(() => {
    if (!showThankYou) return;

    requestAnimationFrame(() => {
      thankYouTopRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
  }, [showThankYou]);

  useEffect(() => {
    const el = tabContainerRef.current;
    if (!el) return;

    const storageKey = `rq:tabScrollLeft:${pathname}`;

    try {
      const raw = sessionStorage.getItem(storageKey);
      if (raw != null) {
        const saved = Number(raw);
        if (Number.isFinite(saved)) {
          requestAnimationFrame(() => {
            const max = Math.max(0, el.scrollWidth - el.clientWidth);
            el.scrollLeft = Math.max(0, Math.min(saved, max));
          });
        }
      }
    } catch {
      // ignore (e.g., storage blocked)
    }

    return () => {
      if (tabScrollSaveRaf.current != null) {
        cancelAnimationFrame(tabScrollSaveRaf.current);
        tabScrollSaveRaf.current = null;
      }
    };
  }, [pathname]);

  const handleTabsScroll = () => {
    const el = tabContainerRef.current;
    if (!el) return;

    const storageKey = `rq:tabScrollLeft:${pathname}`;

    if (tabScrollSaveRaf.current != null) {
      cancelAnimationFrame(tabScrollSaveRaf.current);
    }

    tabScrollSaveRaf.current = requestAnimationFrame(() => {
      try {
        sessionStorage.setItem(storageKey, String(el.scrollLeft));
      } catch {
        // ignore
      }
    });
  };

  const setTab = (tab: string) => {
    setActiveTab(tab);
    setSelectedService(null);
  };

  const [needSomethingElse, setNeedSomethingElse] = useState(false);
  const [otherServiceText, setOtherServiceText] = useState("");

  const [urgencyId, setUrgencyId] = useState<UrgencyOptionId | "">("");

  const allServices = useMemo(() => {
    const flattened: SelectableService[] = [];

    for (const cat of categories || []) {
      for (const grp of cat.groups || []) {
        for (const srv of grp.services || []) {
          flattened.push({
            categorySlug: cat.categorySlug,
            groupSlug: grp.slug,
            serviceSlug: srv.slug,
            title: srv.title,
            popular: srv.popular,
            description: srv.description,
            navDescription: srv.navDescription,
            icon: srv.icon,
            price: srv.price,
            showPrice: srv.showPrice,
          });
        }
      }
    }

    return flattened;
  }, [categories]);

  const activeServices = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    let list = allServices;

    if (activeTab === "popular") {
      list = list.filter((s) => s.popular);
    } else if (activeTab !== "all") {
      list = list.filter((s) => s.categorySlug === activeTab);
    }

    if (q) {
      list = list.filter((s) => {
        const hay = `${s.title} ${s.description || ""} ${s.navDescription || ""}`.toLowerCase();
        return hay.includes(q);
      });
    }

    return list;
  }, [allServices, activeTab, searchQuery]);

  const activeCategoryTitle = useMemo(() => {
    if (activeTab === "all") return "All Services";
    if (activeTab === "popular") return "Popular Services";
    return categories.find((c) => c.categorySlug === activeTab)?.category || "Services";
  }, [activeTab, categories]);

  const canContinue = Boolean(
    urgencyId && (selectedService || (needSomethingElse && otherServiceText.trim().length > 0))
  );

  const emailOk = useMemo(() => {
    const e = contactEmail.trim();
    if (!e) return false;
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
  }, [contactEmail]);

  const canContinueStep2 = Boolean(
    canContinue &&
      contactFirstName.trim() &&
      contactLastName.trim() &&
      emailOk &&
      contactPhone.trim()
  );

  const canContinueStep3 = Boolean(
    canContinueStep2 && streetAddress.trim() && city.trim() && zipCode.trim()
  );

  const canSubmit = Boolean(
    canContinueStep3 && (!wantsTechnicianVisitFirst || (preferredDate && preferredTime))
  );

  const serviceSummary = useMemo(() => {
    if (selectedService?.title) return selectedService.title;
    if (needSomethingElse && otherServiceText.trim()) return otherServiceText.trim();
    return "Service not selected";
  }, [needSomethingElse, otherServiceText, selectedService]);

  const contactName = useMemo(() => {
    const name = `${contactFirstName} ${contactLastName}`.trim();
    return name || "—";
  }, [contactFirstName, contactLastName]);

  const handleContinue = () => {
    if (!canContinue) return;

    setStep(2);
  };

  const handleBackToStep1 = () => {
    setStep(1);
  };

  const handleBackToStep2 = () => {
    setStep(2);
  };

  const handleBackToStep3 = () => {
    setStep(3);
  };

  const handleContinueToStep3 = () => {
    if (!canContinueStep2) return;
    setStep(3);
  };

  const handleContinueToStep4 = () => {
    if (!canContinueStep3) return;
    setStep(4);
  };

  const handleSubmit = async () => {
    if (!canSubmit || submitting) return;

    setSubmitError("");
    setSubmitting(true);

    try {
      const payload = {
        service: selectedService
          ? {
              category: selectedService.categorySlug,
              group: selectedService.groupSlug,
              service: selectedService.serviceSlug,
            }
          : undefined,
        urgency: urgencyId || undefined,
        other: needSomethingElse && otherServiceText.trim() ? otherServiceText.trim() : undefined,
        contact: {
          firstName: contactFirstName.trim(),
          lastName: contactLastName.trim(),
          email: contactEmail.trim(),
          phone: contactPhone.trim(),
        },
        location: {
          streetAddress: streetAddress.trim(),
          city: city.trim(),
          zipCode: zipCode.trim(),
        },
        details: {
          projectDetails: projectDetails.trim() || undefined,
          wantsTechnicianVisitFirst,
          preferredDate: wantsTechnicianVisitFirst ? (preferredDate || undefined) : undefined,
          preferredTime: wantsTechnicianVisitFirst ? (preferredTime || undefined) : undefined,
          heardAbout: heardAbout || undefined,
        },
      };

      const res = await fetch("/api/quote-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to submit request");

      const json = (await res.json().catch(() => null)) as
        | { success?: boolean; referenceNumber?: string }
        | null;

      setReferenceNumber(json?.referenceNumber || "");
      setShowThankYou(true);
    } catch {
      setSubmitError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (showThankYou) {
    return (
      <RequestQuoteThankYou
        topRef={thankYouTopRef}
        referenceNumber={referenceNumber}
        wantsTechnicianVisitFirst={wantsTechnicianVisitFirst}
        preferredDate={preferredDate}
        preferredTime={preferredTime}
        contactEmail={contactEmail}
        contactPhone={contactPhone}
        onBackHome={() => router.push("/")}
        onBrowseServices={() => router.push("/services")}
      />
    );
  }

  const progressFillClass =
    step === 1
      ? "rq-client__progressFill rq-client__progressFill--25"
      : step === 2
        ? "rq-client__progressFill rq-client__progressFill--50"
        : step === 3
          ? "rq-client__progressFill rq-client__progressFill--75"
          : "rq-client__progressFill rq-client__progressFill--100";

  return (
    <div className="rq-client__page">
      {/* Top header */}
      <div className="rq-client__hero">
        <div className="rq-client__heroInner">
          <div className="rq-client__heroIconWrap">
            <SvgIcon name="document" size={34} color="#00E793" />
          </div>
          <h1 className="rq-client__heroTitle">
            Request a Free Quote
          </h1>
          <p className="rq-client__heroSubtitle">
            Get a personalized quote for your service needs. No obligation, fast response, and expert recommendations.
          </p>

          <div className="rq-client__stepsGrid">
            {steps.map((step, i) => (
              <div
                key={step.title}
                className="rq-client__stepCard"
              >
                <div className="rq-client__stepNum">
                  {i + 1}
                </div>
                <div className="rq-client__stepTitle">{step.title}</div>
                <div className="rq-client__stepDesc">{step.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Step 1 + Sidebar section */}
      <div
        ref={stepSectionRef}
        className="rq-client__contentSection"
      >
        <div className="rq-client__contentGrid">
          {/* Left: Step 1 */}
          <div className="rq-client__main">
            <div className="rq-client__progressRow">
              <span>
                {step === 1 ? "Step 1 of 4" : step === 2 ? "Step 2 of 4" : step === 3 ? "Step 3 of 4" : "Step 4 of 4"}
              </span>
              <span className="rq-client__progressPct">
                {step === 1 ? "25% Complete" : step === 2 ? "50% Complete" : step === 3 ? "75% Complete" : "100% Complete"}
              </span>
            </div>
            <div className="rq-client__progressBar">
              <div className={progressFillClass} />
            </div>

            <div className="rq-client__stepCardWrap">
              {step === 1 ? (
                <Step1ServiceSelection
                  categories={categories}
                  activeTab={activeTab}
                  setTab={setTab}
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  tabContainerRef={tabContainerRef}
                  onTabsScroll={handleTabsScroll}
                  activeCategoryTitle={activeCategoryTitle}
                  activeServices={activeServices}
                  selectedService={selectedService}
                  setSelectedService={setSelectedService}
                  needSomethingElse={needSomethingElse}
                  setNeedSomethingElse={setNeedSomethingElse}
                  otherServiceText={otherServiceText}
                  setOtherServiceText={setOtherServiceText}
                  urgencyOptions={urgencyOptions}
                  urgencyId={urgencyId}
                  setUrgencyId={setUrgencyId}
                  canContinue={canContinue}
                  onContinue={handleContinue}
                />
              ) : step === 2 ? (
                <Step2ContactInfo
                  serviceSummary={serviceSummary}
                  urgencyId={urgencyId}
                  contactFirstName={contactFirstName}
                  setContactFirstName={setContactFirstName}
                  contactLastName={contactLastName}
                  setContactLastName={setContactLastName}
                  contactEmail={contactEmail}
                  setContactEmail={setContactEmail}
                  emailOk={emailOk}
                  contactPhone={contactPhone}
                  setContactPhone={setContactPhone}
                  canContinue={canContinueStep2}
                  onBack={handleBackToStep1}
                  onContinue={handleContinueToStep3}
                />
              ) : step === 3 ? (
                <Step3Location
                  serviceSummary={serviceSummary}
                  urgencyId={urgencyId}
                  contactName={contactName}
                  streetAddress={streetAddress}
                  setStreetAddress={setStreetAddress}
                  city={city}
                  setCity={setCity}
                  zipCode={zipCode}
                  setZipCode={setZipCode}
                  canContinue={canContinueStep3}
                  onBack={handleBackToStep2}
                  onContinue={handleContinueToStep4}
                />
              ) : (
                <Step4AdditionalDetails
                  projectDetails={projectDetails}
                  setProjectDetails={setProjectDetails}
                  wantsTechnicianVisitFirst={wantsTechnicianVisitFirst}
                  setWantsTechnicianVisitFirst={setWantsTechnicianVisitFirst}
                  preferredDate={preferredDate}
                  setPreferredDate={setPreferredDate}
                  preferredTime={preferredTime}
                  setPreferredTime={setPreferredTime}
                  heardAbout={heardAbout}
                  setHeardAbout={setHeardAbout}
                  canSubmit={canSubmit}
                  submitting={submitting}
                  submitError={submitError}
                  onBack={handleBackToStep3}
                  onSubmit={handleSubmit}
                />
              )}
            </div>
          </div>

          {/* Right: Sidebar */}
          <div className="rq-client__aside">
            <RequestQuoteSidebar rqContent={rqContent} />
          </div>
        </div>
      </div>
    </div>
  );
}
