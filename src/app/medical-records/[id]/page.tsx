"use client";

import Link from "next/link";
import {
  useEffect,
  useState,
} from "react";

import {
  Activity,
  AlertCircle,
  ArrowLeft,
  Building2,
  CalendarDays,
  ClipboardList,
  FileText,
  FolderOpen,
  Loader2,
  Pencil,
  Stethoscope,
  UserRound,
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
  Diagnosis,
  MedicalDocument,
  MedicalRecord,
  TreatmentRecord,
} from "@/types/medicalRecord";


interface MedicalRecordDetailsPageProps {
  params: Promise<{
    id: string;
  }>;
}


function formatDate(
  value?: string | null
): string {
  if (!value) {
    return "N/A";
  }

  const date =
    new Date(value);

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return value;
  }

  return new Intl.DateTimeFormat(
    "en-GB",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  ).format(date);
}


function formatFileSize(
  bytes?: number
): string {
  if (!bytes) {
    return "0 KB";
  }

  const kb =
    bytes / 1024;

  if (kb < 1024) {
    return `${kb.toFixed(1)} KB`;
  }

  return `${(
    kb / 1024
  ).toFixed(1)} MB`;
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
      === 403
    ) {
      return (
        "You do not have permission "
        + "to view this Medical Record."
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

  return (
    "Unable to load Medical Record details."
  );
}


export default function MedicalRecordDetailsPage({
  params,
}: MedicalRecordDetailsPageProps) {
  const [
    currentUser,
    setCurrentUser,
  ] =
    useState<AuthUser | null>(
      null
    );

  const [
    recordId,
    setRecordId,
  ] =
    useState("");

  const [
    record,
    setRecord,
  ] =
    useState<MedicalRecord | null>(
      null
    );

  const [
    diagnoses,
    setDiagnoses,
  ] =
    useState<Diagnosis[]>(
      []
    );

  const [
    treatments,
    setTreatments,
  ] =
    useState<TreatmentRecord[]>(
      []
    );

  const [
    documents,
    setDocuments,
  ] =
    useState<MedicalDocument[]>(
      []
    );

  const [
    loading,
    setLoading,
  ] =
    useState(true);

  const [
    error,
    setError,
  ] =
    useState("");


  /*
   * =========================================================
   * USER + ROUTE PARAM
   * =========================================================
   */
  useEffect(
    () => {
      setCurrentUser(
        getStoredUser()
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
   * LOAD RECORD + RELATED DATA
   * =========================================================
   */
  useEffect(
    () => {
      if (!recordId) {
        return;
      }

      let cancelled =
        false;

      const loadRecord =
        async () => {
          setLoading(true);
          setError("");

          try {
            const [
              recordResponse,
              diagnosisResponse,
              treatmentResponse,
              documentResponse,
            ] =
              await Promise.all([
                medicalRecordService
                  .getMedicalRecordById(
                    recordId
                  ),

                medicalRecordService
                  .getDiagnosesByRecord(
                    recordId
                  ),

                medicalRecordService
                  .getTreatmentsByRecord(
                    recordId
                  ),

                medicalRecordService
                  .getDocumentsByRecord(
                    recordId
                  ),
              ]);

            if (cancelled) {
              return;
            }

            setRecord(
              recordResponse
            );

            setDiagnoses(
              diagnosisResponse
            );

            setTreatments(
              treatmentResponse
            );

            setDocuments(
              documentResponse
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
    ]
  );


  /*
   * =========================================================
   * DOCTOR OWNERSHIP
   * =========================================================
   */
  const canEdit =
    Boolean(
      record
      && currentUser?.role
        === "DOCTOR"
      && record.doctorId
        === currentUser.id
    );


  /*
   * =========================================================
   * NAVIGATION LINKS
   * =========================================================
   */
  const backHref =
    record
      ? (
        `/medical-records?patientId=${
          encodeURIComponent(
            record.patientId
          )
        }`
      )
      : "/medical-records";


  const historyHref =
    record
      ? (
        `/medical-records/history?patientId=${
          encodeURIComponent(
            record.patientId
          )
        }`
      )
      : "/medical-records/history";


  const documentsHref =
    record
      ? (
        `/medical-records/documents?patientId=${
          encodeURIComponent(
            record.patientId
          )
        }`
      )
      : "/medical-records/documents";


  const editHref =
    record
      ? (
        `/medical-records/${
          encodeURIComponent(
            record.id
          )
        }/edit`
      )
      : "#";


  const diagnosesHref =
    record
      ? (
        `/medical-records/${
          encodeURIComponent(
            record.id
          )
        }/diagnoses`
      )
      : "#";


  const treatmentsHref =
    record
      ? (
        `/medical-records/${
          encodeURIComponent(
            record.id
          )
        }/treatments`
      )
      : "#";


  return (
    <DashboardLayout
      pageTitle="Medical Record Details"
    >
      <div
        className="
          mx-auto
          w-full
          max-w-7xl
          space-y-5
        "
      >
        {/* ==============================================
            HEADER
            ============================================== */}
        <div
          className="
            flex
            flex-col
            gap-4
            sm:flex-row
            sm:items-start
            sm:justify-between
          "
        >
          <div>
            <Link
              href={
                backHref
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

              Back to EHR
            </Link>


            <h1
              className="
                mt-3
                text-2xl
                font-bold
                text-slate-900
              "
            >
              Medical Record Details
            </h1>


            <p
              className="
                mt-1
                text-sm
                text-slate-500
              "
            >
              Complete clinical information
              for this patient visit.
            </p>
          </div>


          {record && (
            <div
              className="
                flex
                flex-wrap
                gap-2
              "
            >
              {/* EDIT RECORD */}
              {canEdit && (
                <Link
                  href={
                    editHref
                  }
                  className="
                    inline-flex
                    items-center
                    justify-center
                    gap-2
                    rounded-xl
                    bg-blue-600
                    px-4
                    py-2.5
                    text-sm
                    font-semibold
                    text-white
                    shadow-sm
                    transition
                    hover:bg-blue-700
                  "
                >
                  <Pencil
                    className="
                      h-4
                      w-4
                    "
                  />

                  Edit Record
                </Link>
              )}


              {/* MANAGE DIAGNOSES */}
              {canEdit && (
                <Link
                  href={
                    diagnosesHref
                  }
                  className="
                    inline-flex
                    items-center
                    justify-center
                    gap-2
                    rounded-xl
                    border
                    border-indigo-200
                    bg-indigo-50
                    px-4
                    py-2.5
                    text-sm
                    font-semibold
                    text-indigo-700
                    shadow-sm
                    transition
                    hover:bg-indigo-100
                  "
                >
                  <Stethoscope
                    className="
                      h-4
                      w-4
                    "
                  />

                  Manage Diagnoses
                </Link>
              )}


              {/* MANAGE TREATMENTS */}
              {canEdit && (
                <Link
                  href={
                    treatmentsHref
                  }
                  className="
                    inline-flex
                    items-center
                    justify-center
                    gap-2
                    rounded-xl
                    border
                    border-emerald-200
                    bg-emerald-50
                    px-4
                    py-2.5
                    text-sm
                    font-semibold
                    text-emerald-700
                    shadow-sm
                    transition
                    hover:bg-emerald-100
                  "
                >
                  <Activity
                    className="
                      h-4
                      w-4
                    "
                  />

                  Manage Treatments
                </Link>
              )}


              {/* FULL HISTORY */}
              <Link
                href={
                  historyHref
                }
                className="
                  inline-flex
                  items-center
                  justify-center
                  rounded-xl
                  border
                  border-slate-200
                  bg-white
                  px-4
                  py-2.5
                  text-sm
                  font-semibold
                  text-slate-700
                  shadow-sm
                  transition
                  hover:border-blue-300
                  hover:text-blue-600
                "
              >
                Full History
              </Link>


              {/* DOCUMENTS */}
              <Link
                href={
                  documentsHref
                }
                className="
                  inline-flex
                  items-center
                  justify-center
                  rounded-xl
                  border
                  border-slate-200
                  bg-white
                  px-4
                  py-2.5
                  text-sm
                  font-semibold
                  text-slate-700
                  shadow-sm
                  transition
                  hover:border-blue-300
                  hover:text-blue-600
                "
              >
                Documents
              </Link>
            </div>
          )}
        </div>


        {/* ==============================================
            LOADING
            ============================================== */}
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


        {/* ==============================================
            ERROR
            ============================================== */}
        {!loading
          && error
          && (
            <div
              className="
                flex
                items-start
                gap-3
                rounded-2xl
                border
                border-red-200
                bg-red-50
                p-5
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
                    font-semibold
                  "
                >
                  Unable to load record
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
          )
        }


        {!loading
          && !error
          && record
          && (
            <>
              {/* ==========================================
                  RECORD HERO
                  ========================================== */}
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
                    flex-col
                    gap-5
                    lg:flex-row
                    lg:items-start
                    lg:justify-between
                  "
                >
                  <div
                    className="
                      min-w-0
                      flex-1
                    "
                  >
                    <div
                      className="
                        flex
                        flex-wrap
                        items-center
                        gap-2
                      "
                    >
                      <span
                        className="
                          rounded-full
                          bg-blue-50
                          px-3
                          py-1.5
                          text-xs
                          font-bold
                          text-blue-700
                        "
                      >
                        {
                          record.recordType
                        }
                      </span>


                      <span
                        className="
                          rounded-full
                          bg-emerald-50
                          px-3
                          py-1.5
                          text-xs
                          font-bold
                          text-emerald-700
                        "
                      >
                        {
                          record.status
                        }
                      </span>


                      <span
                        className="
                          rounded-full
                          bg-slate-100
                          px-3
                          py-1.5
                          text-xs
                          font-semibold
                          text-slate-600
                        "
                      >
                        Version{" "}
                        {
                          record.version
                        }
                      </span>
                    </div>


                    <h2
                      className="
                        mt-4
                        text-2xl
                        font-bold
                        text-slate-900
                      "
                    >
                      {
                        record.diagnosis
                      }
                    </h2>


                    <p
                      className="
                        mt-2
                        max-w-3xl
                        text-sm
                        leading-6
                        text-slate-600
                      "
                    >
                      {
                        record.clinicalSummary
                      }
                    </p>
                  </div>


                  <div
                    className="
                      grid
                      min-w-72
                      gap-3
                    "
                  >
                    <div
                      className="
                        flex
                        items-start
                        gap-3
                        rounded-xl
                        bg-slate-50
                        p-3
                      "
                    >
                      <CalendarDays
                        className="
                          mt-0.5
                          h-5
                          w-5
                          text-blue-600
                        "
                      />

                      <div>
                        <p
                          className="
                            text-xs
                            text-slate-400
                          "
                        >
                          Visit Date
                        </p>

                        <p
                          className="
                            mt-1
                            text-sm
                            font-semibold
                            text-slate-800
                          "
                        >
                          {formatDate(
                            record.visitDate
                          )}
                        </p>
                      </div>
                    </div>


                    <div
                      className="
                        flex
                        items-start
                        gap-3
                        rounded-xl
                        bg-slate-50
                        p-3
                      "
                    >
                      <Building2
                        className="
                          mt-0.5
                          h-5
                          w-5
                          text-blue-600
                        "
                      />

                      <div>
                        <p
                          className="
                            text-xs
                            text-slate-400
                          "
                        >
                          Hospital
                        </p>

                        <p
                          className="
                            mt-1
                            text-sm
                            font-semibold
                            text-slate-800
                          "
                        >
                          {
                            record.hospitalName
                          }
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>


              {/* ==========================================
                  PATIENT / DOCTOR
                  ========================================== */}
              <div
                className="
                  grid
                  gap-5
                  lg:grid-cols-2
                "
              >
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
                      gap-3
                    "
                  >
                    <div
                      className="
                        flex
                        h-10
                        w-10
                        items-center
                        justify-center
                        rounded-xl
                        bg-blue-50
                        text-blue-600
                      "
                    >
                      <UserRound
                        className="
                          h-5
                          w-5
                        "
                      />
                    </div>

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
                          tracking-wide
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
                        {
                          record.patientId
                        }
                      </p>
                    </div>
                  </div>
                </section>


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
                      gap-3
                    "
                  >
                    <div
                      className="
                        flex
                        h-10
                        w-10
                        items-center
                        justify-center
                        rounded-xl
                        bg-indigo-50
                        text-indigo-600
                      "
                    >
                      <Stethoscope
                        className="
                          h-5
                          w-5
                        "
                      />
                    </div>

                    <div>
                      <p
                        className="
                          text-xs
                          font-semibold
                          uppercase
                          tracking-wide
                          text-slate-400
                        "
                      >
                        Attending Doctor
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
                          record.doctorName
                        }
                      </p>
                    </div>
                  </div>
                </section>
              </div>


              {/* ==========================================
                  SYMPTOMS / TREATMENT PLAN
                  ========================================== */}
              <div
                className="
                  grid
                  gap-5
                  lg:grid-cols-2
                "
              >
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
                      flex
                      items-center
                      gap-2
                      font-bold
                      text-slate-900
                    "
                  >
                    <ClipboardList
                      className="
                        h-5
                        w-5
                        text-rose-500
                      "
                    />

                    Symptoms
                  </h2>


                  {record.symptoms
                    ?.length > 0
                    ? (
                      <div
                        className="
                          mt-4
                          flex
                          flex-wrap
                          gap-2
                        "
                      >
                        {record.symptoms.map(
                          (
                            symptom
                          ) => (
                            <span
                              key={
                                symptom
                              }
                              className="
                                rounded-xl
                                border
                                border-rose-100
                                bg-rose-50
                                px-3
                                py-2
                                text-sm
                                font-medium
                                text-rose-700
                              "
                            >
                              {symptom}
                            </span>
                          )
                        )}
                      </div>
                    )
                    : (
                      <p
                        className="
                          mt-4
                          text-sm
                          text-slate-500
                        "
                      >
                        No symptoms recorded.
                      </p>
                    )
                  }
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
                      flex
                      items-center
                      gap-2
                      font-bold
                      text-slate-900
                    "
                  >
                    <Activity
                      className="
                        h-5
                        w-5
                        text-emerald-600
                      "
                    />

                    Treatment Plan
                  </h2>


                  {record.treatmentPlan
                    ?.length > 0
                    ? (
                      <div
                        className="
                          mt-4
                          space-y-2
                        "
                      >
                        {record
                          .treatmentPlan
                          .map(
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
                                    text-sm
                                    leading-6
                                    text-emerald-800
                                  "
                                >
                                  {item}
                                </p>
                              </div>
                            )
                          )}
                      </div>
                    )
                    : (
                      <p
                        className="
                          mt-4
                          text-sm
                          text-slate-500
                        "
                      >
                        No treatment plan recorded.
                      </p>
                    )
                  }
                </section>
              </div>


              {/* ==========================================
                  DIAGNOSES
                  ========================================== */}
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
                    flex-col
                    gap-3
                    sm:flex-row
                    sm:items-center
                    sm:justify-between
                  "
                >
                  <div
                    className="
                      flex
                      items-center
                      gap-2
                    "
                  >
                    <Stethoscope
                      className="
                        h-5
                        w-5
                        text-indigo-600
                      "
                    />

                    <h2
                      className="
                        text-lg
                        font-bold
                        text-slate-900
                      "
                    >
                      Diagnoses
                    </h2>

                    <span
                      className="
                        rounded-full
                        bg-indigo-50
                        px-2.5
                        py-1
                        text-xs
                        font-bold
                        text-indigo-700
                      "
                    >
                      {diagnoses.length}
                    </span>
                  </div>


                  {canEdit && (
                    <Link
                      href={
                        diagnosesHref
                      }
                      className="
                        inline-flex
                        items-center
                        justify-center
                        gap-2
                        rounded-xl
                        border
                        border-indigo-200
                        bg-indigo-50
                        px-3
                        py-2
                        text-xs
                        font-semibold
                        text-indigo-700
                        transition
                        hover:bg-indigo-100
                      "
                    >
                      <Stethoscope
                        className="
                          h-3.5
                          w-3.5
                        "
                      />

                      Manage Diagnoses
                    </Link>
                  )}
                </div>


                {diagnoses.length === 0
                  ? (
                    <p
                      className="
                        mt-4
                        text-sm
                        text-slate-500
                      "
                    >
                      No additional diagnoses
                      linked to this record.
                    </p>
                  )
                  : (
                    <div
                      className="
                        mt-4
                        grid
                        gap-3
                        md:grid-cols-2
                      "
                    >
                      {diagnoses.map(
                        (
                          diagnosis
                        ) => (
                          <article
                            key={
                              diagnosis.id
                            }
                            className="
                              rounded-xl
                              border
                              border-indigo-100
                              bg-indigo-50/60
                              p-4
                            "
                          >
                            <div
                              className="
                                flex
                                items-start
                                justify-between
                                gap-3
                              "
                            >
                              <h3
                                className="
                                  text-sm
                                  font-bold
                                  text-indigo-950
                                "
                              >
                                {
                                  diagnosis.diagnosisName
                                }
                              </h3>


                              {diagnosis.severity && (
                                <span
                                  className="
                                    rounded-full
                                    bg-white
                                    px-2.5
                                    py-1
                                    text-[10px]
                                    font-bold
                                    uppercase
                                    text-indigo-600
                                  "
                                >
                                  {
                                    diagnosis.severity
                                  }
                                </span>
                              )}
                            </div>


                            {diagnosis.description && (
                              <p
                                className="
                                  mt-2
                                  text-xs
                                  leading-5
                                  text-indigo-700
                                "
                              >
                                {
                                  diagnosis.description
                                }
                              </p>
                            )}


                            <p
                              className="
                                mt-3
                                text-[11px]
                                text-indigo-500
                              "
                            >
                              Diagnosed:{" "}
                              {formatDate(
                                diagnosis.diagnosedDate
                              )}
                            </p>
                          </article>
                        )
                      )}
                    </div>
                  )
                }
              </section>


              {/* ==========================================
                  TREATMENT RECORDS
                  ========================================== */}
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
                    flex-col
                    gap-3
                    sm:flex-row
                    sm:items-center
                    sm:justify-between
                  "
                >
                  <div
                    className="
                      flex
                      items-center
                      gap-2
                    "
                  >
                    <Activity
                      className="
                        h-5
                        w-5
                        text-emerald-600
                      "
                    />

                    <h2
                      className="
                        text-lg
                        font-bold
                        text-slate-900
                      "
                    >
                      Treatment Records
                    </h2>

                    <span
                      className="
                        rounded-full
                        bg-emerald-50
                        px-2.5
                        py-1
                        text-xs
                        font-bold
                        text-emerald-700
                      "
                    >
                      {treatments.length}
                    </span>
                  </div>


                  {canEdit && (
                    <Link
                      href={
                        treatmentsHref
                      }
                      className="
                        inline-flex
                        items-center
                        justify-center
                        gap-2
                        rounded-xl
                        border
                        border-emerald-200
                        bg-emerald-50
                        px-3
                        py-2
                        text-xs
                        font-semibold
                        text-emerald-700
                        transition
                        hover:bg-emerald-100
                      "
                    >
                      <Activity
                        className="
                          h-3.5
                          w-3.5
                        "
                      />

                      Manage Treatments
                    </Link>
                  )}
                </div>


                {treatments.length === 0
                  ? (
                    <p
                      className="
                        mt-4
                        text-sm
                        text-slate-500
                      "
                    >
                      No linked treatment records.
                    </p>
                  )
                  : (
                    <div
                      className="
                        mt-4
                        grid
                        gap-3
                        md:grid-cols-2
                      "
                    >
                      {treatments.map(
                        (
                          treatment
                        ) => (
                          <article
                            key={
                              treatment.id
                            }
                            className="
                              rounded-xl
                              border
                              border-emerald-100
                              bg-emerald-50/60
                              p-4
                            "
                          >
                            <div
                              className="
                                flex
                                items-start
                                justify-between
                                gap-3
                              "
                            >
                              <h3
                                className="
                                  text-sm
                                  font-bold
                                  text-emerald-950
                                "
                              >
                                {
                                  treatment.treatmentType
                                }
                              </h3>


                              {treatment.status && (
                                <span
                                  className="
                                    rounded-full
                                    bg-white
                                    px-2.5
                                    py-1
                                    text-[10px]
                                    font-bold
                                    uppercase
                                    text-emerald-600
                                  "
                                >
                                  {
                                    treatment.status
                                  }
                                </span>
                              )}
                            </div>


                            {treatment.description && (
                              <p
                                className="
                                  mt-2
                                  text-xs
                                  leading-5
                                  text-emerald-700
                                "
                              >
                                {
                                  treatment.description
                                }
                              </p>
                            )}


                            <p
                              className="
                                mt-3
                                text-[11px]
                                text-emerald-600
                              "
                            >
                              {formatDate(
                                treatment.startDate
                              )}

                              {treatment.endDate
                                ? (
                                  <>
                                    {" → "}
                                    {formatDate(
                                      treatment.endDate
                                    )}
                                  </>
                                )
                                : " → Ongoing"
                              }
                            </p>
                          </article>
                        )
                      )}
                    </div>
                  )
                }
              </section>


              {/* ==========================================
                  CONSULTATION NOTES
                  ========================================== */}
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


                {record.consultationNotes
                  ? (
                    <p
                      className="
                        mt-4
                        whitespace-pre-wrap
                        rounded-xl
                        bg-slate-50
                        p-4
                        text-sm
                        leading-7
                        text-slate-700
                      "
                    >
                      {
                        record.consultationNotes
                      }
                    </p>
                  )
                  : (
                    <p
                      className="
                        mt-4
                        text-sm
                        text-slate-500
                      "
                    >
                      No consultation notes recorded.
                    </p>
                  )
                }
              </section>


              {/* ==========================================
                  DOCUMENTS
                  ========================================== */}
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
                    flex-col
                    gap-3
                    sm:flex-row
                    sm:items-center
                    sm:justify-between
                  "
                >
                  <div
                    className="
                      flex
                      items-center
                      gap-2
                    "
                  >
                    <FolderOpen
                      className="
                        h-5
                        w-5
                        text-amber-600
                      "
                    />

                    <h2
                      className="
                        text-lg
                        font-bold
                        text-slate-900
                      "
                    >
                      Linked Documents
                    </h2>

                    <span
                      className="
                        rounded-full
                        bg-amber-50
                        px-2.5
                        py-1
                        text-xs
                        font-bold
                        text-amber-700
                      "
                    >
                      {documents.length}
                    </span>
                  </div>


                  <Link
                    href={
                      documentsHref
                    }
                    className="
                      text-sm
                      font-semibold
                      text-blue-600
                      transition
                      hover:text-blue-700
                    "
                  >
                    View all documents
                  </Link>
                </div>


                {documents.length === 0
                  ? (
                    <p
                      className="
                        mt-4
                        text-sm
                        text-slate-500
                      "
                    >
                      No active documents linked
                      to this record.
                    </p>
                  )
                  : (
                    <div
                      className="
                        mt-4
                        grid
                        gap-3
                        md:grid-cols-2
                        xl:grid-cols-3
                      "
                    >
                      {documents.map(
                        (
                          document
                        ) => (
                          <article
                            key={
                              document.id
                            }
                            className="
                              rounded-xl
                              border
                              border-slate-200
                              bg-slate-50/60
                              p-4
                            "
                          >
                            <div
                              className="
                                flex
                                items-start
                                justify-between
                                gap-3
                              "
                            >
                              <FileText
                                className="
                                  h-5
                                  w-5
                                  shrink-0
                                  text-blue-600
                                "
                              />


                              <span
                                className="
                                  rounded-full
                                  bg-emerald-50
                                  px-2
                                  py-1
                                  text-[10px]
                                  font-bold
                                  text-emerald-700
                                "
                              >
                                {
                                  document.status
                                }
                              </span>
                            </div>


                            <h3
                              title={
                                document.fileName
                              }
                              className="
                                mt-3
                                truncate
                                text-sm
                                font-bold
                                text-slate-900
                              "
                            >
                              {
                                document.fileName
                              }
                            </h3>


                            <p
                              className="
                                mt-1
                                text-xs
                                font-semibold
                                text-blue-600
                              "
                            >
                              {
                                document.documentType
                              }
                            </p>


                            {document.description && (
                              <p
                                className="
                                  mt-2
                                  line-clamp-2
                                  text-xs
                                  leading-5
                                  text-slate-500
                                "
                              >
                                {
                                  document.description
                                }
                              </p>
                            )}


                            <div
                              className="
                                mt-3
                                flex
                                items-center
                                justify-between
                                text-[11px]
                                text-slate-400
                              "
                            >
                              <span>
                                Version{" "}
                                {
                                  document.version
                                }
                              </span>

                              <span>
                                {formatFileSize(
                                  document.fileSize
                                )}
                              </span>
                            </div>


                            <a
                              href={
                                document.fileUrl
                              }
                              target="_blank"
                              rel="noreferrer"
                              className="
                                mt-4
                                inline-flex
                                rounded-lg
                                bg-blue-600
                                px-3
                                py-2
                                text-xs
                                font-semibold
                                text-white
                                transition
                                hover:bg-blue-700
                              "
                            >
                              Open Document
                            </a>
                          </article>
                        )
                      )}
                    </div>
                  )
                }
              </section>
            </>
          )
        }
      </div>
    </DashboardLayout>
  );
}