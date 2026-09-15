"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  type FormEvent,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  AlertCircle,
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  FileText,
  Loader2,
  Plus,
  Save,
  Stethoscope,
  UserRound,
  X,
} from "lucide-react";

import DashboardLayout from "@/components/medical-records/MedicalRecordsShell";

import {
  getStoredUser,
  type AuthUser,
} from "@/lib/auth";

import {
  medicalRecordService,
} from "@/services/medicalRecordService";

import type {
  MedicalRecord,
  MedicalRecordRequest,
} from "@/types/medicalRecord";


interface EditMedicalRecordPageProps {
  params: Promise<{
    id: string;
  }>;
}


function getErrorMessage(
  error: unknown
): string {
  if (
    typeof error === "object"
    && error !== null
    && "response" in error
  ) {
    const requestError =
      error as {
        response?: {
          status?: number;
          data?: {
            message?: string;
          };
        };
      };

    if (
      requestError.response?.status
      === 400
    ) {
      return (
        requestError
          .response
          ?.data
          ?.message
        || "Please check the entered clinical information."
      );
    }

    if (
      requestError.response?.status
      === 403
    ) {
      return (
        "You do not have permission "
        + "to update this Medical Record."
      );
    }

    if (
      requestError.response?.status
      === 404
    ) {
      return (
        "The requested Medical Record "
        + "was not found."
      );
    }

    if (
      requestError
        .response
        ?.data
        ?.message
    ) {
      return requestError
        .response
        .data
        .message;
    }
  }

  return "Unable to update Medical Record.";
}


function normalizeDate(
  value?: string | null
): string {
  if (!value) {
    return "";
  }

  return value.length >= 10
    ? value.slice(0, 10)
    : value;
}


export default function EditMedicalRecordPage({
  params,
}: EditMedicalRecordPageProps) {
  const router =
    useRouter();

  const [
    currentUser,
    setCurrentUser,
  ] = useState<AuthUser | null>(
    null
  );

  const [
    recordId,
    setRecordId,
  ] = useState("");

  const [
    originalRecord,
    setOriginalRecord,
  ] =
    useState<MedicalRecord | null>(
      null
    );

  const [
    patientId,
    setPatientId,
  ] = useState("");

  const [
    hospitalName,
    setHospitalName,
  ] = useState("");

  const [
    visitDate,
    setVisitDate,
  ] = useState("");

  const [
    recordType,
    setRecordType,
  ] = useState("");

  const [
    diagnosis,
    setDiagnosis,
  ] = useState("");

  const [
    clinicalSummary,
    setClinicalSummary,
  ] = useState("");

  const [
    consultationNotes,
    setConsultationNotes,
  ] = useState("");

  const [
    symptoms,
    setSymptoms,
  ] = useState<string[]>(
    []
  );

  const [
    symptomInput,
    setSymptomInput,
  ] = useState("");

  const [
    treatmentPlan,
    setTreatmentPlan,
  ] = useState<string[]>(
    []
  );

  const [
    treatmentInput,
    setTreatmentInput,
  ] = useState("");

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    submitting,
    setSubmitting,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState("");

  const [
    success,
    setSuccess,
  ] = useState("");


  /*
   * =========================================================
   * AUTH + ROUTE PARAM
   * =========================================================
   */
  useEffect(
    () => {
      const storedUser =
        getStoredUser();

      if (!storedUser) {
        setError(
          "Please login to edit Medical Records."
        );

        setLoading(false);

        return;
      }

      setCurrentUser(
        storedUser
      );

      const resolveParams =
        async () => {
          const resolved =
            await params;

          setRecordId(
            resolved.id
          );
        };

      void resolveParams();
    },
    [
      params,
    ]
  );


  /*
   * =========================================================
   * LOAD EXISTING RECORD
   * =========================================================
   */
  useEffect(
    () => {
      if (
        !recordId
        || !currentUser
      ) {
        return;
      }

      if (
        currentUser.role
        !== "DOCTOR"
      ) {
        setError(
          "Only doctors can update Medical Records."
        );

        setLoading(false);

        return;
      }

      let cancelled =
        false;

      const loadRecord =
        async () => {
          setLoading(true);
          setError("");

          try {
            const record =
              await medicalRecordService
                .getMedicalRecordById(
                  recordId
                );

            if (cancelled) {
              return;
            }

            /*
             * Frontend safety check.
             * Backend also verifies ownership.
             */
            if (
              record.doctorId
              !== currentUser.id
            ) {
              setError(
                "You can only update Medical Records created by you."
              );

              setLoading(false);

              return;
            }

            setOriginalRecord(
              record
            );

            setPatientId(
              record.patientId
            );

            setHospitalName(
              record.hospitalName ?? ""
            );

            setVisitDate(
              normalizeDate(
                record.visitDate
              )
            );

            setRecordType(
              record.recordType ?? ""
            );

            setDiagnosis(
              record.diagnosis ?? ""
            );

            setClinicalSummary(
              record.clinicalSummary ?? ""
            );

            setConsultationNotes(
              record.consultationNotes
              ?? ""
            );

            setSymptoms(
              record.symptoms
              ?? []
            );

            setTreatmentPlan(
              record.treatmentPlan
              ?? []
            );
          } catch (
            requestError
          ) {
            if (!cancelled) {
              setError(
                getErrorMessage(
                  requestError
                )
              );
            }
          } finally {
            if (!cancelled) {
              setLoading(false);
            }
          }
        };

      void loadRecord();

      return () => {
        cancelled = true;
      };
    },
    [
      recordId,
      currentUser,
    ]
  );


  const formValid =
    useMemo(
      () =>
        Boolean(
          patientId.trim()
          && hospitalName.trim()
          && visitDate
          && recordType.trim()
          && diagnosis.trim()
          && clinicalSummary.trim()
        ),
      [
        patientId,
        hospitalName,
        visitDate,
        recordType,
        diagnosis,
        clinicalSummary,
      ]
    );


  /*
   * =========================================================
   * SYMPTOMS
   * =========================================================
   */
  const addSymptom =
    () => {
      const value =
        symptomInput.trim();

      if (!value) {
        return;
      }

      const alreadyExists =
        symptoms.some(
          (item) =>
            item.toLowerCase()
            === value.toLowerCase()
        );

      if (!alreadyExists) {
        setSymptoms(
          (previous) => [
            ...previous,
            value,
          ]
        );
      }

      setSymptomInput("");
    };


  const removeSymptom =
    (
      index: number
    ) => {
      setSymptoms(
        (previous) =>
          previous.filter(
            (
              _,
              currentIndex
            ) =>
              currentIndex
              !== index
          )
      );
    };


  /*
   * =========================================================
   * TREATMENT PLAN
   * =========================================================
   */
  const addTreatmentPlanItem =
    () => {
      const value =
        treatmentInput.trim();

      if (!value) {
        return;
      }

      setTreatmentPlan(
        (previous) => [
          ...previous,
          value,
        ]
      );

      setTreatmentInput("");
    };


  const removeTreatmentPlanItem =
    (
      index: number
    ) => {
      setTreatmentPlan(
        (previous) =>
          previous.filter(
            (
              _,
              currentIndex
            ) =>
              currentIndex
              !== index
          )
      );
    };


  /*
   * =========================================================
   * UPDATE RECORD
   * =========================================================
   */
  const handleSubmit =
    async (
      event:
      FormEvent<HTMLFormElement>
    ) => {
      event.preventDefault();

      if (
        !currentUser
        || currentUser.role
        !== "DOCTOR"
      ) {
        setError(
          "Only doctors can update Medical Records."
        );

        return;
      }

      if (
        !originalRecord
      ) {
        setError(
          "Medical Record is not available."
        );

        return;
      }

      if (
        originalRecord.doctorId
        !== currentUser.id
      ) {
        setError(
          "You can only update Medical Records created by you."
        );

        return;
      }

      if (!formValid) {
        setError(
          "Please complete all required fields."
        );

        return;
      }

      setSubmitting(true);
      setError("");
      setSuccess("");

      const request:
        MedicalRecordRequest = {
          /*
           * Patient ID is preserved.
           * User cannot change ownership.
           */
          patientId:
            originalRecord.patientId,

          hospitalName:
            hospitalName.trim(),

          visitDate,

          recordType:
            recordType.trim(),

          diagnosis:
            diagnosis.trim(),

          clinicalSummary:
            clinicalSummary.trim(),

          symptoms,

          treatmentPlan,

          consultationNotes:
            consultationNotes
              .trim()
            || undefined,

          /*
           * Preserve current status.
           */
          status:
            originalRecord.status,
        };

      try {
        const updated =
          await medicalRecordService
            .updateMedicalRecord(
              recordId,
              request
            );

        setSuccess(
          "Medical Record updated successfully."
        );

        setTimeout(
          () => {
            router.push(
              `/medical-records/${
                encodeURIComponent(
                  updated.id
                )
              }`
            );
          },
          700
        );
      } catch (
        requestError
      ) {
        setError(
          getErrorMessage(
            requestError
          )
        );
      } finally {
        setSubmitting(false);
      }
    };


  const detailsHref =
    recordId
      ? (
        `/medical-records/${
          encodeURIComponent(
            recordId
          )
        }`
      )
      : "/medical-records";


  return (
    <DashboardLayout
      pageTitle="Edit Medical Record"
    >
      <div
        className="
          mx-auto
          w-full
          max-w-5xl
          space-y-5
        "
      >
        {/* HEADER */}
        <div>
          <Link
            href={
              detailsHref
            }
            className="
              inline-flex
              items-center
              gap-2
              text-sm
              font-semibold
              text-blue-600
              transition
              hover:text-blue-700
            "
          >
            <ArrowLeft
              className="
                h-4
                w-4
              "
            />

            Back to Record
          </Link>

          <div
            className="
              mt-4
              flex
              items-start
              gap-3
            "
          >
            <div
              className="
                flex
                h-12
                w-12
                shrink-0
                items-center
                justify-center
                rounded-2xl
                bg-blue-50
                text-blue-600
              "
            >
              <Stethoscope
                className="
                  h-6
                  w-6
                "
              />
            </div>

            <div>
              <h1
                className="
                  text-2xl
                  font-bold
                  text-slate-900
                "
              >
                Edit Medical Record
              </h1>

              <p
                className="
                  mt-1
                  text-sm
                  leading-6
                  text-slate-500
                "
              >
                Update clinical information
                for this patient visit.
              </p>
            </div>
          </div>
        </div>


        {/* ERROR */}
        {error && (
          <div
            className="
              flex
              items-start
              gap-3
              rounded-2xl
              border
              border-red-200
              bg-red-50
              p-4
              text-red-700
            "
          >
            <AlertCircle
              className="
                mt-0.5
                h-5
                w-5
                shrink-0
              "
            />

            <div>
              <p
                className="
                  text-sm
                  font-semibold
                "
              >
                Unable to edit record
              </p>

              <p
                className="
                  mt-1
                  text-sm
                "
              >
                {error}
              </p>
            </div>
          </div>
        )}


        {/* SUCCESS */}
        {success && (
          <div
            className="
              flex
              items-center
              gap-3
              rounded-2xl
              border
              border-emerald-200
              bg-emerald-50
              p-4
              text-emerald-700
            "
          >
            <CheckCircle2
              className="
                h-5
                w-5
              "
            />

            <p
              className="
                text-sm
                font-semibold
              "
            >
              {success}
            </p>
          </div>
        )}


        {/* LOADING */}
        {loading && (
          <div
            className="
              flex
              min-h-72
              items-center
              justify-center
              rounded-2xl
              border
              border-slate-200
              bg-white
            "
          >
            <div
              className="
                text-center
              "
            >
              <Loader2
                className="
                  mx-auto
                  h-8
                  w-8
                  animate-spin
                  text-blue-600
                "
              />

              <p
                className="
                  mt-3
                  text-sm
                  text-slate-500
                "
              >
                Loading Medical Record...
              </p>
            </div>
          </div>
        )}


        {!loading
          && originalRecord
          && currentUser?.role
            === "DOCTOR"
          && originalRecord.doctorId
            === currentUser.id
          && (
            <form
              onSubmit={
                handleSubmit
              }
              className="
                space-y-5
              "
            >
              {/* DOCTOR + PATIENT */}
              <section
                className="
                  grid
                  gap-4
                  md:grid-cols-2
                "
              >
                <div
                  className="
                    rounded-2xl
                    border
                    border-blue-100
                    bg-blue-50/60
                    p-4
                  "
                >
                  <div
                    className="
                      flex
                      items-center
                      gap-3
                    "
                  >
                    <Stethoscope
                      className="
                        h-5
                        w-5
                        text-blue-600
                      "
                    />

                    <div>
                      <p
                        className="
                          text-xs
                          font-semibold
                          uppercase
                          text-blue-500
                        "
                      >
                        Doctor
                      </p>

                      <p
                        className="
                          mt-1
                          text-sm
                          font-bold
                          text-slate-800
                        "
                      >
                        {
                          currentUser.fullName
                        }
                      </p>
                    </div>
                  </div>
                </div>


                <div
                  className="
                    rounded-2xl
                    border
                    border-slate-200
                    bg-white
                    p-4
                  "
                >
                  <div
                    className="
                      flex
                      items-center
                      gap-3
                    "
                  >
                    <UserRound
                      className="
                        h-5
                        w-5
                        text-slate-500
                      "
                    />

                    <div
                      className="
                        min-w-0
                      "
                    >
                      <p
                        className="
                          text-xs
                          font-semibold
                          uppercase
                          text-slate-400
                        "
                      >
                        Patient ID
                      </p>

                      <p
                        className="
                          mt-1
                          break-all
                          text-sm
                          font-bold
                          text-slate-800
                        "
                      >
                        {patientId}
                      </p>
                    </div>
                  </div>

                  <p
                    className="
                      mt-3
                      text-xs
                      text-slate-400
                    "
                  >
                    Patient ownership cannot
                    be changed during an update.
                  </p>
                </div>
              </section>


              {/* VISIT INFORMATION */}
              <section
                className="
                  rounded-2xl
                  border
                  border-slate-200
                  bg-white
                  p-5
                  shadow-sm
                "
              >
                <div
                  className="
                    flex
                    items-center
                    gap-2
                  "
                >
                  <CalendarDays
                    className="
                      h-5
                      w-5
                      text-blue-600
                    "
                  />

                  <h2
                    className="
                      text-lg
                      font-bold
                      text-slate-900
                    "
                  >
                    Visit Information
                  </h2>
                </div>

                <div
                  className="
                    mt-5
                    grid
                    gap-4
                    md:grid-cols-2
                  "
                >
                  <div>
                    <label
                      className="
                        mb-1.5
                        block
                        text-sm
                        font-semibold
                        text-slate-700
                      "
                    >
                      Hospital / Clinic *
                    </label>

                    <input
                      type="text"
                      value={
                        hospitalName
                      }
                      onChange={
                        (
                          event
                        ) =>
                          setHospitalName(
                            event.target.value
                          )
                      }
                      className="
                        w-full
                        rounded-xl
                        border
                        border-slate-200
                        px-3
                        py-2.5
                        text-sm
                        outline-none
                        focus:border-blue-500
                        focus:ring-2
                        focus:ring-blue-100
                      "
                    />
                  </div>


                  <div>
                    <label
                      className="
                        mb-1.5
                        block
                        text-sm
                        font-semibold
                        text-slate-700
                      "
                    >
                      Visit Date *
                    </label>

                    <input
                      type="date"
                      value={
                        visitDate
                      }
                      onChange={
                        (
                          event
                        ) =>
                          setVisitDate(
                            event.target.value
                          )
                      }
                      className="
                        w-full
                        rounded-xl
                        border
                        border-slate-200
                        px-3
                        py-2.5
                        text-sm
                        outline-none
                        focus:border-blue-500
                        focus:ring-2
                        focus:ring-blue-100
                      "
                    />
                  </div>


                  <div
                    className="
                      md:col-span-2
                    "
                  >
                    <label
                      className="
                        mb-1.5
                        block
                        text-sm
                        font-semibold
                        text-slate-700
                      "
                    >
                      Record Type *
                    </label>

                    <select
                      value={
                        recordType
                      }
                      onChange={
                        (
                          event
                        ) =>
                          setRecordType(
                            event.target.value
                          )
                      }
                      className="
                        w-full
                        rounded-xl
                        border
                        border-slate-200
                        bg-white
                        px-3
                        py-2.5
                        text-sm
                        outline-none
                        focus:border-blue-500
                        focus:ring-2
                        focus:ring-blue-100
                      "
                    >
                      <option value="Consultation">
                        Consultation
                      </option>

                      <option value="Follow-up">
                        Follow-up
                      </option>

                      <option value="Emergency">
                        Emergency
                      </option>

                      <option value="Admission">
                        Admission
                      </option>

                      <option value="Discharge">
                        Discharge
                      </option>

                      <option value="Procedure">
                        Procedure
                      </option>

                      <option value="Other">
                        Other
                      </option>
                    </select>
                  </div>
                </div>
              </section>


              {/* CLINICAL */}
              <section
                className="
                  rounded-2xl
                  border
                  border-slate-200
                  bg-white
                  p-5
                  shadow-sm
                "
              >
                <h2
                  className="
                    text-lg
                    font-bold
                    text-slate-900
                  "
                >
                  Clinical Details
                </h2>

                <div
                  className="
                    mt-5
                    space-y-4
                  "
                >
                  <div>
                    <label
                      className="
                        mb-1.5
                        block
                        text-sm
                        font-semibold
                        text-slate-700
                      "
                    >
                      Primary Diagnosis *
                    </label>

                    <input
                      value={
                        diagnosis
                      }
                      onChange={
                        (
                          event
                        ) =>
                          setDiagnosis(
                            event.target.value
                          )
                      }
                      className="
                        w-full
                        rounded-xl
                        border
                        border-slate-200
                        px-3
                        py-2.5
                        text-sm
                        outline-none
                        focus:border-blue-500
                        focus:ring-2
                        focus:ring-blue-100
                      "
                    />
                  </div>


                  <div>
                    <label
                      className="
                        mb-1.5
                        block
                        text-sm
                        font-semibold
                        text-slate-700
                      "
                    >
                      Clinical Summary *
                    </label>

                    <textarea
                      rows={5}
                      value={
                        clinicalSummary
                      }
                      onChange={
                        (
                          event
                        ) =>
                          setClinicalSummary(
                            event.target.value
                          )
                      }
                      className="
                        w-full
                        resize-y
                        rounded-xl
                        border
                        border-slate-200
                        px-3
                        py-2.5
                        text-sm
                        leading-6
                        outline-none
                        focus:border-blue-500
                        focus:ring-2
                        focus:ring-blue-100
                      "
                    />
                  </div>
                </div>
              </section>


              {/* SYMPTOMS */}
              <section
                className="
                  rounded-2xl
                  border
                  border-slate-200
                  bg-white
                  p-5
                  shadow-sm
                "
              >
                <h2
                  className="
                    text-lg
                    font-bold
                    text-slate-900
                  "
                >
                  Symptoms
                </h2>

                <div
                  className="
                    mt-4
                    flex
                    flex-col
                    gap-2
                    sm:flex-row
                  "
                >
                  <input
                    value={
                      symptomInput
                    }
                    onChange={
                      (
                        event
                      ) =>
                        setSymptomInput(
                          event.target.value
                        )
                    }
                    onKeyDown={
                      (
                        event
                      ) => {
                        if (
                          event.key
                          === "Enter"
                        ) {
                          event.preventDefault();
                          addSymptom();
                        }
                      }
                    }
                    placeholder="Add symptom"
                    className="
                      flex-1
                      rounded-xl
                      border
                      border-slate-200
                      px-3
                      py-2.5
                      text-sm
                      outline-none
                      focus:border-blue-500
                      focus:ring-2
                      focus:ring-blue-100
                    "
                  />

                  <button
                    type="button"
                    onClick={
                      addSymptom
                    }
                    className="
                      inline-flex
                      items-center
                      justify-center
                      gap-2
                      rounded-xl
                      bg-blue-50
                      px-4
                      py-2.5
                      text-sm
                      font-semibold
                      text-blue-700
                    "
                  >
                    <Plus
                      className="
                        h-4
                        w-4
                      "
                    />

                    Add
                  </button>
                </div>


                {symptoms.length > 0 && (
                  <div
                    className="
                      mt-4
                      flex
                      flex-wrap
                      gap-2
                    "
                  >
                    {symptoms.map(
                      (
                        symptom,
                        index
                      ) => (
                        <span
                          key={
                            `${symptom}-${index}`
                          }
                          className="
                            inline-flex
                            items-center
                            gap-2
                            rounded-xl
                            bg-rose-50
                            px-3
                            py-2
                            text-sm
                            text-rose-700
                          "
                        >
                          {symptom}

                          <button
                            type="button"
                            onClick={
                              () =>
                                removeSymptom(
                                  index
                                )
                            }
                          >
                            <X
                              className="
                                h-3.5
                                w-3.5
                              "
                            />
                          </button>
                        </span>
                      )
                    )}
                  </div>
                )}
              </section>


              {/* TREATMENT PLAN */}
              <section
                className="
                  rounded-2xl
                  border
                  border-slate-200
                  bg-white
                  p-5
                  shadow-sm
                "
              >
                <h2
                  className="
                    text-lg
                    font-bold
                    text-slate-900
                  "
                >
                  Treatment Plan
                </h2>

                <div
                  className="
                    mt-4
                    flex
                    flex-col
                    gap-2
                    sm:flex-row
                  "
                >
                  <input
                    value={
                      treatmentInput
                    }
                    onChange={
                      (
                        event
                      ) =>
                        setTreatmentInput(
                          event.target.value
                        )
                    }
                    onKeyDown={
                      (
                        event
                      ) => {
                        if (
                          event.key
                          === "Enter"
                        ) {
                          event.preventDefault();

                          addTreatmentPlanItem();
                        }
                      }
                    }
                    placeholder="Add treatment plan item"
                    className="
                      flex-1
                      rounded-xl
                      border
                      border-slate-200
                      px-3
                      py-2.5
                      text-sm
                      outline-none
                      focus:border-blue-500
                      focus:ring-2
                      focus:ring-blue-100
                    "
                  />

                  <button
                    type="button"
                    onClick={
                      addTreatmentPlanItem
                    }
                    className="
                      inline-flex
                      items-center
                      justify-center
                      gap-2
                      rounded-xl
                      bg-emerald-50
                      px-4
                      py-2.5
                      text-sm
                      font-semibold
                      text-emerald-700
                    "
                  >
                    <Plus
                      className="
                        h-4
                        w-4
                      "
                    />

                    Add
                  </button>
                </div>


                {treatmentPlan.length > 0 && (
                  <div
                    className="
                      mt-4
                      space-y-2
                    "
                  >
                    {treatmentPlan.map(
                      (
                        item,
                        index
                      ) => (
                        <div
                          key={
                            `${item}-${index}`
                          }
                          className="
                            flex
                            items-start
                            gap-3
                            rounded-xl
                            border
                            border-emerald-100
                            bg-emerald-50/60
                            p-3
                          "
                        >
                          <span
                            className="
                              flex
                              h-6
                              w-6
                              shrink-0
                              items-center
                              justify-center
                              rounded-full
                              bg-emerald-600
                              text-xs
                              font-bold
                              text-white
                            "
                          >
                            {index + 1}
                          </span>

                          <p
                            className="
                              flex-1
                              text-sm
                              text-emerald-800
                            "
                          >
                            {item}
                          </p>

                          <button
                            type="button"
                            onClick={
                              () =>
                                removeTreatmentPlanItem(
                                  index
                                )
                            }
                          >
                            <X
                              className="
                                h-4
                                w-4
                              "
                            />
                          </button>
                        </div>
                      )
                    )}
                  </div>
                )}
              </section>


              {/* CONSULTATION NOTES */}
              <section
                className="
                  rounded-2xl
                  border
                  border-slate-200
                  bg-white
                  p-5
                  shadow-sm
                "
              >
                <div
                  className="
                    flex
                    items-center
                    gap-2
                  "
                >
                  <FileText
                    className="
                      h-5
                      w-5
                      text-blue-600
                    "
                  />

                  <h2
                    className="
                      text-lg
                      font-bold
                      text-slate-900
                    "
                  >
                    Consultation Notes
                  </h2>
                </div>

                <textarea
                  rows={6}
                  value={
                    consultationNotes
                  }
                  onChange={
                    (
                      event
                    ) =>
                      setConsultationNotes(
                        event.target.value
                      )
                  }
                  className="
                    mt-4
                    w-full
                    resize-y
                    rounded-xl
                    border
                    border-slate-200
                    px-3
                    py-2.5
                    text-sm
                    leading-6
                    outline-none
                    focus:border-blue-500
                    focus:ring-2
                    focus:ring-blue-100
                  "
                />
              </section>


              {/* ACTIONS */}
              <section
                className="
                  flex
                  flex-col-reverse
                  gap-3
                  rounded-2xl
                  border
                  border-slate-200
                  bg-white
                  p-5
                  shadow-sm
                  sm:flex-row
                  sm:items-center
                  sm:justify-between
                "
              >
                <Link
                  href={
                    detailsHref
                  }
                  className="
                    inline-flex
                    items-center
                    justify-center
                    rounded-xl
                    border
                    border-slate-200
                    px-5
                    py-2.5
                    text-sm
                    font-semibold
                    text-slate-700
                    hover:bg-slate-50
                  "
                >
                  Cancel
                </Link>

                <button
                  type="submit"
                  disabled={
                    submitting
                    || !formValid
                  }
                  className="
                    inline-flex
                    items-center
                    justify-center
                    gap-2
                    rounded-xl
                    bg-blue-600
                    px-6
                    py-2.5
                    text-sm
                    font-semibold
                    text-white
                    transition
                    hover:bg-blue-700
                    disabled:cursor-not-allowed
                    disabled:opacity-50
                  "
                >
                  {submitting
                    ? (
                      <Loader2
                        className="
                          h-4
                          w-4
                          animate-spin
                        "
                      />
                    )
                    : (
                      <Save
                        className="
                          h-4
                          w-4
                        "
                      />
                    )
                  }

                  {submitting
                    ? "Saving..."
                    : "Save Changes"
                  }
                </button>
              </section>
            </form>
          )
        }
      </div>
    </DashboardLayout>
  );
}