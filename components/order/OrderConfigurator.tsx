"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import {
  Baby,
  Briefcase,
  CakeSlice,
  Check,
  Heart,
  Info,
  Loader2,
  Minus,
  PenLine,
  Plus,
  Sparkles,
  Users,
  type LucideIcon,
} from "lucide-react";
import { getLenis } from "@/components/animations/SmoothScroll";
import { Button, ButtonLink } from "@/components/ui/Button";
import { images } from "@/data/images";
import { inspirations, occasions } from "@/data/order";
import { formatLongDate } from "@/lib/dates";
import { siteConfig, telHref } from "@/lib/site.config";
import { cn } from "@/lib/utils";
import { TransitionLink } from "@/components/animations/PageTransition";
import { DatePicker } from "./DatePicker";
import { Field, FieldError, inputCls } from "./fields";
import { isDemoMode, submitOrder } from "./formspree";
import { orderSchema, STEP_FIELDS, STEPS, type OrderValues } from "./schema";

const ease = [0.22, 1, 0.36, 1] as const;
const ICONS: Record<string, LucideIcon> = {
  anniversaire: CakeSlice,
  mariage: Heart,
  bapteme: Baby,
  famille: Users,
  entreprise: Briefcase,
  autre: Sparkles,
};

/** Les id du catalogue « Demander cette création » renvoient vers une inspiration. */
const INSPIRATION_ALIASES: Record<string, string> = {
  "grand-fraisier": "grand-fraisier",
  "number-cake": "number-cake",
  "entremets-trompe-loeil": "assortiment",
};

type Status = "idle" | "sending" | "success" | "error";

/**
 * Le champ quitté ne se revalide pas au moment du clic : sinon son message
 * d'erreur disparaît, le bouton remonte sous le pointeur et le clic est perdu.
 */
const keepFocus = (e: React.MouseEvent) => e.preventDefault();

export function OrderConfigurator() {
  const params = useSearchParams();
  const preset = INSPIRATION_ALIASES[params.get("inspiration") ?? ""];
  const presetInspiration = inspirations.find((i) => i.id === preset);

  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1);
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const top = useRef<HTMLDivElement>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const lastView = useRef(`${0}-idle`);

  const {
    register,
    control,
    handleSubmit,
    trigger,
    setValue,
    getValues,
    reset,
    formState: { errors },
  } = useForm<OrderValues>({
    resolver: zodResolver(orderSchema),
    mode: "onTouched",
    defaultValues: {
      occasion: undefined,
      occasionOther: "",
      inspiration: presetInspiration?.id ?? "",
      cakeType: presetInspiration?.defaultType ?? "",
      guests: siteConfig.order.guests.default,
      pickupDate: "",
      message: "",
      flavours: "",
      theme: "",
      allergies: "",
      details: "",
      fullName: "",
      email: "",
      phone: "",
      consent: false as unknown as true,
      company: "",
    },
  });

  const values = useWatch({ control });

  useEffect(() => {
    // Ne défile que lorsque l'étape ou l'état change réellement (pas au premier affichage).
    const view = `${step}-${status}`;
    if (lastView.current === view) return;
    lastView.current = view;
    if (status === "sending" || status === "error") return;
    const el = top.current;
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - 110;
      const lenis = getLenis();
      if (lenis) lenis.scrollTo(y, { duration: 0.9 });
      else window.scrollTo({ top: y, behavior: "smooth" });
    }
    heading.current?.focus({ preventScroll: true });
  }, [step, status]);

  const goTo = (n: number) => {
    setDir(n > step ? 1 : -1);
    setStep(n);
  };

  const next = async () => {
    const ok = await trigger(STEP_FIELDS[step], { shouldFocus: true });
    if (ok) goTo(Math.min(step + 1, STEPS.length - 1));
  };

  const onSubmit = handleSubmit(async (v) => {
    if (isDemoMode) return;
    setStatus("sending");
    setErrorMsg("");
    const res = await submitOrder(v);
    if (res.ok) setStatus("success");
    else {
      setStatus("error");
      setErrorMsg(res.message);
    }
  });

  const occasionLabel = occasions.find((o) => o.id === values.occasion)?.label;
  const inspiration = inspirations.find((i) => i.id === values.inspiration);
  const msgLen = values.message?.length ?? 0;

  if (status === "success") {
    return (
      <div ref={top} className="mx-auto max-w-2xl py-10 text-center">
        <svg viewBox="0 0 80 80" className="mx-auto size-20 text-blue" aria-hidden="true">
          <motion.circle cx="40" cy="40" r="37" fill="none" stroke="currentColor" strokeWidth="1.5" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.9, ease }} />
          <motion.path d="M25 41 L36 52 L56 30" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.6, delay: 0.7, ease }} />
        </svg>
        <h2 ref={heading} tabIndex={-1} className="t-h2 mt-8 text-blue-deep outline-none">
          Votre demande a bien été transmise !
        </h2>
        <p className="t-lead mt-6 text-ink/80">
          Notre équipe reviendra vers vous pour confirmer les détails, la disponibilité et le tarif de votre
          création.
        </p>
        <p className="mt-6 inline-block border-l-2 border-champagne bg-ivory px-5 py-4 text-left font-semibold text-blue-deep">
          L’envoi de votre demande ne constitue pas une confirmation de commande.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <ButtonLink href="/nos-creations" variant="outline">
            Découvrir nos créations
          </ButtonLink>
          <Button
            type="button"
            onClick={() => {
              reset();
              setStatus("idle");
              setStep(0);
            }}
          >
            Faire une autre demande
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div ref={top} className="grid gap-10 lg:grid-cols-12 lg:gap-12">
      {/* Progression et résumé vivant */}
      <aside className="min-w-0 lg:col-span-4" aria-label="Progression de la demande">
        <div className="lg:sticky lg:top-[calc(var(--header-h)+2rem)]">
          <ol className="scroll-row -mx-1 flex gap-1 overflow-x-auto px-1 lg:mx-0 lg:flex-col lg:gap-0 lg:overflow-visible lg:px-0">
            {STEPS.map((s, i) => {
              const state = i < step ? "done" : i === step ? "current" : "todo";
              return (
                <li key={s.title} className="shrink-0">
                  <button
                    type="button"
                    disabled={i > step}
                    onClick={() => i < step && goTo(i)}
                    aria-current={state === "current" ? "step" : undefined}
                    className={cn(
                      "flex min-h-11 items-center gap-3 rounded-full px-3 text-[0.92rem] transition-colors lg:w-full lg:rounded-none lg:border-b lg:border-line lg:px-0 lg:py-3",
                      state === "current" ? "bg-blue-deep text-ivory lg:bg-transparent lg:text-blue-deep" : state === "done" ? "text-blue-deep hover:text-blue" : "text-ink/40",
                    )}
                  >
                    <span
                      className={cn(
                        "grid size-7 shrink-0 place-items-center rounded-full border text-xs font-semibold tabular-nums transition-colors",
                        state === "done" ? "border-blue bg-blue text-ivory" : state === "current" ? "border-champagne text-champagne lg:border-blue-deep lg:text-blue-deep" : "border-current",
                      )}
                    >
                      {state === "done" ? <Check className="size-3.5" aria-hidden="true" /> : i + 1}
                    </span>
                    <span className={cn("whitespace-nowrap", state === "current" && "font-semibold")}>
                      <span className="lg:hidden">{s.short}</span>
                      <span className="hidden lg:inline">{s.title}</span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>

          <div className="mt-8 hidden border border-line bg-ivory p-6 lg:block">
            <p className="t-caption text-mute">Votre demande</p>
            <div className="mt-4 flex gap-4">
              <div className="relative size-20 shrink-0 overflow-hidden bg-paper">
                {inspiration?.image ? (
                  <Image src={images[inspiration.image].src} alt="" fill sizes="80px" className="object-cover" />
                ) : (
                  <span className="grid size-full place-items-center text-champagne-deep">
                    <PenLine className="size-6" aria-hidden="true" />
                  </span>
                )}
              </div>
              <dl className="min-w-0 text-[0.92rem] leading-snug">
                <dt className="sr-only">Occasion</dt>
                <dd className="font-semibold text-blue-deep">{occasionLabel ?? "Occasion à choisir"}</dd>
                <dt className="sr-only">Gâteau</dt>
                <dd className="mt-1 truncate text-ink/70">{values.cakeType || inspiration?.label || "Gâteau à définir"}</dd>
                <dt className="sr-only">Personnes</dt>
                <dd className="text-ink/70">{values.guests ? `${values.guests} personnes` : ""}</dd>
                <dt className="sr-only">Date</dt>
                <dd className="text-ink/70 first-letter:uppercase">{values.pickupDate ? formatLongDate(values.pickupDate) : ""}</dd>
              </dl>
            </div>
            <p className="mt-5 flex gap-2 border-t border-line pt-4 t-small text-mute">
              <Info className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
              Aucun paiement en ligne. Le prix et la disponibilité vous sont confirmés par la boutique.
            </p>
          </div>
        </div>
      </aside>

      {/* Étapes */}
      <form
        noValidate
        onSubmit={(e) => {
          e.preventDefault();
          if (step < STEPS.length - 1) void next();
          else void onSubmit(e);
        }}
        className="relative min-w-0 lg:col-span-8"
        aria-labelledby="step-heading"
      >
        {isDemoMode && (
          <div role="note" className="mb-10 flex gap-3 border border-champagne/60 bg-[#fbf5ea] p-5 text-[0.95rem] text-cacao">
            <Info className="mt-0.5 size-5 shrink-0 text-champagne-deep" aria-hidden="true" />
            <p>
              <strong className="font-semibold">Mode démonstration.</strong> Le formulaire n’est pas encore relié à la
              boutique : vous pouvez le parcourir, mais aucune demande ne sera envoyée. Pour commander dès maintenant,
              appelez le{" "}
              <a href={telHref} className="font-semibold underline underline-offset-2">
                {siteConfig.phone.display}
              </a>
              .
            </p>
          </div>
        )}

        {/* Pot de miel antispam, invisible pour les visiteurs */}
        <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
          <label htmlFor="company">Ne pas remplir ce champ</label>
          <input id="company" type="text" tabIndex={-1} autoComplete="off" {...register("company")} />
        </div>

        <p className="t-caption text-champagne-deep">
          Étape {step + 1} sur {STEPS.length}
        </p>
        <h2 id="step-heading" ref={heading} tabIndex={-1} className="t-h2 mt-2 text-blue-deep outline-none">
          {STEPS[step].title}
        </h2>

        <div className="relative mt-10 min-h-[300px]">
          <AnimatePresence mode="wait" initial={false} custom={dir}>
            <motion.div
              key={step}
              custom={dir}
              initial={{ opacity: 0, x: dir * 36 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: dir * -36 }}
              transition={{ duration: 0.45, ease }}
            >
              {step === 0 && (
                <fieldset>
                  <legend className="sr-only">Pour quelle occasion ?</legend>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
                    {occasions.map((o) => {
                      const Icon = ICONS[o.id];
                      const on = values.occasion === o.id;
                      return (
                        <label
                          key={o.id}
                          className={cn(
                            "group relative flex min-h-[112px] cursor-pointer flex-col justify-between gap-4 border p-5 transition-[border-color,background-color] duration-500",
                            on ? "border-blue-deep bg-ivory" : "border-line bg-cream hover:border-blue-deep/40 hover:bg-ivory",
                          )}
                        >
                          <input type="radio" value={o.id} className="peer sr-only" {...register("occasion")} />
                          <span className="flex items-start justify-between">
                            <Icon
                              className={cn("size-6 transition-transform duration-500 ease-[var(--ease-luxe)]", on ? "-rotate-6 scale-110 text-blue" : "text-champagne-deep group-hover:-rotate-3")}
                              strokeWidth={1.4}
                              aria-hidden="true"
                            />
                            <span className={cn("grid size-6 place-items-center rounded-full border transition-colors", on ? "border-blue-deep bg-blue-deep text-ivory" : "border-line")}>
                              <AnimatePresence>
                                {on && (
                                  <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} transition={{ duration: 0.3, ease }}>
                                    <Check className="size-3.5" aria-hidden="true" />
                                  </motion.span>
                                )}
                              </AnimatePresence>
                            </span>
                          </span>
                          <span>
                            <span className="block font-display text-[1.4rem] font-medium leading-tight text-blue-deep">{o.label}</span>
                            <span className="mt-1 block t-small text-mute">{o.hint}</span>
                          </span>
                          <span aria-hidden="true" className="pointer-events-none absolute inset-0 hidden ring-2 ring-blue ring-offset-2 peer-focus-visible:block" />
                        </label>
                      );
                    })}
                  </div>
                  <FieldError id="occasion-error" message={errors.occasion?.message} />
                  <AnimatePresence>
                    {values.occasion === "autre" && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                        <Field id="occasionOther" label="Quelle occasion ?" error={errors.occasionOther?.message} className="mt-8 max-w-md">
                          <input id="occasionOther" className={inputCls} placeholder="Départ en retraite, fiançailles…" aria-invalid={!!errors.occasionOther} {...register("occasionOther")} />
                        </Field>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </fieldset>
              )}

              {step === 1 && (
                <fieldset>
                  <legend className="mb-8 max-w-xl text-ink/75">
                    Des créations déjà réalisées à la boutique, pour vous donner des idées. Chaque gâteau est ensuite
                    adapté à votre demande.
                  </legend>
                  <div className="grid grid-cols-2 gap-4 md:gap-6">
                    {inspirations.map((insp) => {
                      const on = values.inspiration === insp.id;
                      return (
                        <label key={insp.id} className="group relative cursor-pointer">
                          <input
                            type="radio"
                            value={insp.id}
                            className="peer sr-only"
                            {...register("inspiration", {
                              onChange: () => {
                                const current = getValues("cakeType");
                                const known = inspirations.some((x) => x.defaultType && x.defaultType === current);
                                if (!current || known) setValue("cakeType", insp.defaultType);
                              },
                            })}
                          />
                          <div className={cn("relative aspect-[4/5] overflow-hidden border-2 transition-colors duration-500", on ? "border-blue-deep" : "border-transparent")}>
                            {insp.image ? (
                              <Image
                                src={images[insp.image].src}
                                alt={images[insp.image].alt}
                                fill
                                sizes="(min-width: 1024px) 30vw, 45vw"
                                placeholder="blur"
                                className={cn("object-cover transition-transform duration-[1.2s] ease-[var(--ease-luxe)]", on ? "scale-[1.04]" : "group-hover:scale-[1.03]")}
                              />
                            ) : (
                              <div className="flex size-full flex-col items-center justify-center gap-4 bg-blue-deep p-6 text-center text-ivory">
                                <PenLine className="size-8 text-champagne" strokeWidth={1.3} aria-hidden="true" />
                                <span className="font-script text-[1.7rem] leading-tight">Votre idée</span>
                              </div>
                            )}
                            <span className={cn("absolute right-3 top-3 grid size-8 place-items-center rounded-full transition", on ? "bg-blue-deep text-ivory" : "bg-ivory/85 text-transparent")}>
                              <Check className="size-4" aria-hidden="true" />
                            </span>
                          </div>
                          <span className="mt-3 block font-display text-[1.3rem] font-medium leading-tight text-blue-deep">{insp.label}</span>
                          <span className="mt-0.5 block t-small text-mute">{insp.description}</span>
                          <span aria-hidden="true" className="pointer-events-none absolute -inset-1 hidden ring-2 ring-blue peer-focus-visible:block" />
                        </label>
                      );
                    })}
                  </div>
                  <FieldError id="inspiration-error" message={errors.inspiration?.message} />
                </fieldset>
              )}

              {step === 2 && (
                <div className="grid gap-10">
                  <div className="grid gap-10 md:grid-cols-2">
                    <Field id="cakeType" label="Type de gâteau" error={errors.cakeType?.message}>
                      <input id="cakeType" className={inputCls} placeholder="Number cake « 18 », fraisier…" aria-invalid={!!errors.cakeType} {...register("cakeType")} />
                    </Field>
                    <Field id="guests" label="Nombre de personnes" error={errors.guests?.message} hint={`De ${siteConfig.order.guests.min} à ${siteConfig.order.guests.max} personnes`}>
                      <Controller
                        control={control}
                        name="guests"
                        render={({ field }) => (
                          <div className="flex items-center gap-3 border-b border-blue-deep/25 py-1.5">
                            <button type="button" aria-label="Une personne de moins" onClick={() => field.onChange(Math.max(siteConfig.order.guests.min, (Number(field.value) || 0) - 1))} className="grid size-10 place-items-center rounded-full border border-line text-blue-deep transition hover:border-blue-deep">
                              <Minus className="size-4" />
                            </button>
                            <input
                              id="guests"
                              type="number"
                              inputMode="numeric"
                              min={siteConfig.order.guests.min}
                              max={siteConfig.order.guests.max}
                              value={Number.isFinite(field.value) ? field.value : ""}
                              onChange={(e) => field.onChange(e.target.value === "" ? NaN : e.target.valueAsNumber)}
                              onBlur={field.onBlur}
                              aria-invalid={!!errors.guests}
                              aria-describedby="guests-hint"
                              className="w-16 bg-transparent text-center font-display text-[1.8rem] font-medium tabular-nums text-blue-deep [appearance:textfield] focus:outline-none [&::-webkit-inner-spin-button]:appearance-none"
                            />
                            <button type="button" aria-label="Une personne de plus" onClick={() => field.onChange(Math.min(siteConfig.order.guests.max, (Number(field.value) || 0) + 1))} className="grid size-10 place-items-center rounded-full border border-line text-blue-deep transition hover:border-blue-deep">
                              <Plus className="size-4" />
                            </button>
                            <span className="text-mute">personnes</span>
                          </div>
                        )}
                      />
                    </Field>
                  </div>

                  <div>
                    <p id="pickupDate-label" className="text-[0.95rem] font-semibold text-blue-deep">
                      Date de retrait souhaitée
                    </p>
                    <p id="pickupDate-hint" className="mb-4 mt-1 t-small text-mute">
                      Au moins {siteConfig.order.minLeadDays} jours de délai. La date reste à confirmer par la boutique.
                    </p>
                    <Controller
                      control={control}
                      name="pickupDate"
                      render={({ field }) => (
                        <div className="max-w-md">
                          <DatePicker
                            value={field.value}
                            onChange={(iso) => {
                              field.onChange(iso);
                              void trigger("pickupDate");
                            }}
                            invalid={!!errors.pickupDate}
                            labelId="pickupDate-label"
                            describedBy="pickupDate-hint pickupDate-error"
                          />
                        </div>
                      )}
                    />
                    <FieldError id="pickupDate-error" message={errors.pickupDate?.message} />
                  </div>

                  <Field
                    id="message"
                    label="Message à inscrire sur le gâteau"
                    optional
                    error={errors.message?.message}
                    counter={
                      <span className={cn("t-small tabular-nums", msgLen > siteConfig.order.messageMaxLength ? "text-[#9e3a28]" : "text-mute")}>
                        {msgLen}/{siteConfig.order.messageMaxLength}
                      </span>
                    }
                  >
                    <input id="message" className={inputCls} placeholder="Joyeux anniversaire Léa" aria-invalid={!!errors.message} {...register("message")} />
                  </Field>

                  <div className="grid gap-10 md:grid-cols-2">
                    <Field id="flavours" label="Saveurs souhaitées" optional error={errors.flavours?.message}>
                      <textarea id="flavours" rows={3} className={cn(inputCls, "resize-y")} placeholder="Fruits rouges, vanille, chocolat…" {...register("flavours")} />
                    </Field>
                    <Field id="theme" label="Couleurs ou thème de décoration" optional error={errors.theme?.message}>
                      <textarea id="theme" rows={3} className={cn(inputCls, "resize-y")} placeholder="Rose poudré et blanc, fleurs fraîches…" {...register("theme")} />
                    </Field>
                  </div>

                  <Field id="allergies" label="Allergies et contraintes alimentaires" optional error={errors.allergies?.message} hint="Fruits à coque, gluten, lactose… Signalez tout ce qui compte pour vos invités.">
                    <textarea id="allergies" rows={2} className={cn(inputCls, "resize-y")} aria-describedby="allergies-hint" {...register("allergies")} />
                  </Field>

                  <Field id="details" label="Informations complémentaires" optional error={errors.details?.message}>
                    <textarea id="details" rows={3} className={cn(inputCls, "resize-y")} placeholder="Une idée précise, une contrainte d’horaire de retrait…" {...register("details")} />
                  </Field>

                  {siteConfig.formspree.acceptsFiles && (
                    <Field id="photo" label="Photo d’inspiration" optional hint={`Image JPG ou PNG, ${siteConfig.formspree.maxFileSizeMb} Mo maximum.`}>
                      <input id="photo" type="file" accept="image/jpeg,image/png,image/webp" className="mt-3 block w-full text-sm file:mr-4 file:min-h-11 file:rounded-[2px] file:border-0 file:bg-blue-deep file:px-5 file:font-semibold file:text-ivory" {...register("photo")} />
                    </Field>
                  )}
                </div>
              )}

              {step === 3 && (
                <div className="grid gap-10">
                  <Field id="fullName" label="Prénom et nom" error={errors.fullName?.message}>
                    <input id="fullName" autoComplete="name" className={inputCls} aria-invalid={!!errors.fullName} {...register("fullName")} />
                  </Field>
                  <div className="grid gap-10 md:grid-cols-2">
                    <Field id="email" label="Adresse e-mail" error={errors.email?.message}>
                      <input id="email" type="email" inputMode="email" autoComplete="email" className={inputCls} aria-invalid={!!errors.email} {...register("email")} />
                    </Field>
                    <Field id="phone" label="Téléphone" error={errors.phone?.message} hint="Pour vous joindre rapidement au sujet de votre gâteau.">
                      <input id="phone" type="tel" inputMode="tel" autoComplete="tel" className={inputCls} aria-invalid={!!errors.phone} aria-describedby="phone-hint" {...register("phone")} />
                    </Field>
                  </div>
                  <div>
                    <p className="text-[0.95rem] font-semibold text-blue-deep">Mode de retrait</p>
                    <p className="mt-3 flex items-center gap-3 border-b border-blue-deep/25 py-3 text-ink">
                      <span className="grid size-5 place-items-center rounded-full border-[5px] border-blue-deep" aria-hidden="true" />
                      {siteConfig.order.pickupLabel}
                    </p>
                  </div>
                  <div>
                    <label className="flex cursor-pointer items-start gap-4">
                      <input type="checkbox" className="mt-1 size-5 shrink-0 accent-[var(--color-blue-deep)]" aria-invalid={!!errors.consent} aria-describedby="consent-error" {...register("consent")} />
                      <span className="text-[0.95rem] leading-relaxed text-ink/85">
                        J’accepte que mes coordonnées soient utilisées par {siteConfig.name} pour traiter ma demande et me
                        recontacter à son sujet. Elles ne servent à rien d’autre.{" "}
                        <TransitionLink href="/confidentialite" className="text-blue underline underline-offset-2">
                          Politique de confidentialité
                        </TransitionLink>
                      </span>
                    </label>
                    <FieldError id="consent-error" message={errors.consent?.message} />
                  </div>
                </div>
              )}

              {step === 4 && <Summary values={values as OrderValues} onEdit={goTo} />}
            </motion.div>
          </AnimatePresence>
        </div>

        {status === "error" && (
          <div role="alert" className="mt-8 border-l-2 border-[#9e3a28] bg-ivory p-5 text-[0.95rem] text-ink">
            <p className="font-semibold text-[#9e3a28]">La demande n’a pas été envoyée.</p>
            <p className="mt-1">
              {errorMsg} Vous pouvez aussi nous appeler au{" "}
              <a href={telHref} className="font-semibold underline">
                {siteConfig.phone.display}
              </a>
              .
            </p>
          </div>
        )}

        <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-line pt-8">
          {step > 0 ? (
            <button type="button" onMouseDown={keepFocus} onClick={() => goTo(step - 1)} className="min-h-12 px-1 font-semibold text-blue-deep link-draw">
              Retour
            </button>
          ) : (
            <span />
          )}
          {step < STEPS.length - 1 ? (
            <Button type="submit" onMouseDown={keepFocus}>
              Continuer
            </Button>
          ) : (
            <Button type="submit" onMouseDown={keepFocus} disabled={isDemoMode || status === "sending"} aria-describedby={isDemoMode ? "demo-note" : undefined}>
              {status === "sending" ? (
                <>
                  <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                  Envoi en cours…
                </>
              ) : isDemoMode ? (
                "Envoi désactivé (démonstration)"
              ) : (
                "Envoyer ma demande"
              )}
            </Button>
          )}
        </div>
        {isDemoMode && step === STEPS.length - 1 && (
          <p id="demo-note" className="mt-3 text-right t-small text-mute">
            Aucune demande n’est envoyée tant que le formulaire n’est pas relié à la boutique.
          </p>
        )}
      </form>
    </div>
  );
}

function Summary({ values: v, onEdit }: { values: OrderValues; onEdit: (step: number) => void }) {
  const occasion = occasions.find((o) => o.id === v.occasion)?.label;
  const insp = inspirations.find((i) => i.id === v.inspiration);
  const groups: { title: string; step: number; rows: [string, string | undefined][] }[] = [
    {
      title: "L’occasion",
      step: 0,
      rows: [["Occasion", v.occasion === "autre" && v.occasionOther ? `${occasion} : ${v.occasionOther}` : occasion]],
    },
    {
      title: "Votre gâteau",
      step: 2,
      rows: [
        ["Inspiration", insp?.label],
        ["Type", v.cakeType],
        ["Personnes", String(v.guests)],
        ["Retrait souhaité", v.pickupDate ? formatLongDate(v.pickupDate) : undefined],
        ["Message", v.message],
        ["Saveurs", v.flavours],
        ["Décoration", v.theme],
        ["Allergies", v.allergies],
        ["Précisions", v.details],
      ],
    },
    {
      title: "Vos coordonnées",
      step: 3,
      rows: [
        ["Nom", v.fullName],
        ["E-mail", v.email],
        ["Téléphone", v.phone],
        ["Retrait", siteConfig.order.pickupLabel],
      ],
    },
  ];

  return (
    <div>
      <div className="grid gap-10">
        {groups.map((g) => (
          <section key={g.title} aria-label={g.title} className="border-t border-blue-deep/15 pt-6">
            <div className="flex items-baseline justify-between">
              <h3 className="t-h3 text-[1.5rem] text-blue-deep">{g.title}</h3>
              <button type="button" onClick={() => onEdit(g.step)} className="t-small font-semibold text-blue link-draw">
                Modifier
              </button>
            </div>
            <dl className="mt-4 grid gap-x-8 gap-y-3 sm:grid-cols-[10rem_1fr]">
              {g.rows
                .filter(([, val]) => val && val.trim())
                .map(([k, val]) => (
                  <div key={k} className="contents">
                    <dt className="text-[0.92rem] text-mute">{k}</dt>
                    <dd className="whitespace-pre-line text-ink first-letter:uppercase">{val}</dd>
                  </div>
                ))}
            </dl>
          </section>
        ))}
      </div>
      <p className="mt-10 border-l-2 border-champagne bg-ivory px-5 py-4 font-semibold text-blue-deep">
        L’envoi de votre demande ne constitue pas une confirmation de commande.
      </p>
      <p className="mt-3 t-small text-mute">
        La boutique vous recontacte pour valider la disponibilité, les détails et le tarif. Aucun paiement n’est
        demandé en ligne.
      </p>
    </div>
  );
}
