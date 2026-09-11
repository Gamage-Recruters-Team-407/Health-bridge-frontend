"use client";

import Link from "next/link";
import {
  type FormEvent,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  useRouter,
} from "next/navigation";

import {
  AlertCircle,
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  ClipboardPlus,
  Loader2,
  Plus,
  Search,
  Stethoscope,
  UserCheck,
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
  MedicalRecordRequest,
  PatientLookupResult,
} from "@/types/medicalRecord";


function today(): string {
  const date =
    new Date();

  const year =
    date.getFullYear();

  const month =
    String(
      date.getMonth() + 1
    ).padStart(
      2,
      "0"
    );

  const day =
    String(
      date.getDate()
    ).padStart(
      2,
      "0"
    );

  return `${year}-${month}-${day}`;
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

    if (
      requestError
        .response
        ?.status === 403
    ) {
      return (
        "You do not have permission "
        + "to perform this action."
      );
    }

    if (
      requestError
        .response
        ?.status === 404
    ) {
      return "Patient was not found.";
    }
  }

  return "Request failed. Please try again.";
}


export default function CreateMedicalRecordPage() {
  const router =
    useRouter();


  const [
    currentUser,
    setCurrentUser,
  ] =
    useState<AuthUser | null>(
      null
    );


  const [
    selectedPatient,
    setSelectedPatient,
  ] =
    useState<PatientLookupResult | null>(
      null
    );


  const [
    patientSearch,
    setPatientSearch,
  ] =
    useState("");


  const [
    patientResults,
    setPatientResults,
  ] =
    useState<PatientLookupResult[]>(
      []
    );


  const [
    patientListOpen,
    setPatientListOpen,
  ] =
    useState(false);


  const [
    searchingPatients,
    setSearchingPatients,
  ] =
    useState(false);


  const [
    patientSearchError,
    setPatientSearchError,
  ] =
    useState("");


  const [
    hospitalName,
    setHospitalName,
  ] =
    useState("");


  const [
    visitDate,
    setVisitDate,
  ] =
    useState(
      today()
    );


  const [
    recordType,
    setRecordType,
  ] =
    useState(
      "Consultation"
    );


  const [
    diagnosis,
    setDiagnosis,
  ] =
    useState("");


  const [
    clinicalSummary,
    setClinicalSummary,
  ] =
    useState("");


  const [
    consultationNotes,
    setConsultationNotes,
  ] =
    useState("");


  const [
    symptoms,
    setSymptoms,
  ] =
    useState<string[]>(
      []
    );


  const [
    symptomInput,
    setSymptomInput,
  ] =
    useState("");


  const [
    treatmentPlan,
    setTreatmentPlan,
  ] =
    useState<string[]>(
      []
    );


  const [
    treatmentInput,
    setTreatmentInput,
  ] =
    useState("");


  const [
    submitting,
    setSubmitting,
  ] =
    useState(false);


  const [
    error,
    setError,
  ] =
    useState("");


  const [
    success,
    setSuccess,
  ] =
    useState("");


  const canCreate =
    currentUser?.role
    === "DOCTOR";


  /*
   * =========================================================
   * AUTH + OPTIONAL ?patientId=
   * =========================================================
   */
  useEffect(
    () => {
      const storedUser =
        getStoredUser();


      if (!storedUser) {
        setError(
          "Please login to continue."
        );

        return;
      }


      setCurrentUser(
        storedUser
      );


      if (
        storedUser.role
        !== "DOCTOR"
      ) {
        setError(
          "Only doctors can create Medical Records."
        );

        return;
      }


      const params =
        new URLSearchParams(
          window.location.search
        );


      const patientId =
        params
          .get("patientId")
          ?.trim();


      if (!patientId) {
        return;
      }


      const resolvePatient =
        async () => {
          setSearchingPatients(
            true
          );

          try {
            const results =
              await medicalRecordService
                .searchPatients(
                  patientId
                );


            const exact =
              results.find(
                (
                  patient
                ) =>
                  patient.id
                  === patientId
              );


            if (exact) {
              setSelectedPatient(
                exact
              );

              return;
            }


            setPatientSearch(
              patientId
            );

            setPatientResults(
              results
            );

            setPatientListOpen(
              true
            );
          } catch (
            requestError
          ) {
            setPatientSearchError(
              getErrorMessage(
                requestError
              )
            );
          } finally {
            setSearchingPatients(
              false
            );
          }
        };


      void resolvePatient();
    },
    []
  );


  /*
   * =========================================================
   * SEARCH PATIENTS - DEBOUNCE
   * =========================================================
   */
  useEffect(
    () => {
      if (
        !canCreate
        || selectedPatient
      ) {
        return;
      }


      const query =
        patientSearch.trim();


      if (
        query.length === 0
      ) {
        return;
      }


      if (
        query.length < 2
      ) {
        setPatientResults(
          []
        );

        return;
      }


      let cancelled =
        false;


      const timeout =
        window.setTimeout(
          () => {
            const search =
              async () => {
                setSearchingPatients(
                  true
                );

                setPatientSearchError(
                  ""
                );


                try {
                  const results =
                    await medicalRecordService
                      .searchPatients(
                        query
                      );


                  if (cancelled) {
                    return;
                  }


                  setPatientResults(
                    results
                  );

                  setPatientListOpen(
                    true
                  );
                } catch (
                  requestError
                ) {
                  if (cancelled) {
                    return;
                  }


                  setPatientResults(
                    []
                  );

                  setPatientSearchError(
                    getErrorMessage(
                      requestError
                    )
                  );
                } finally {
                  if (!cancelled) {
                    setSearchingPatients(
                      false
                    );
                  }
                }
              };


            void search();
          },
          350
        );


      return () => {
        cancelled = true;

        window.clearTimeout(
          timeout
        );
      };
    },
    [
      patientSearch,
      selectedPatient,
      canCreate,
    ]
  );


  /*
   * =========================================================
   * LOAD DEFAULT PATIENT LIST WHEN FIELD CLICKED
   * =========================================================
   */
  const openPatientSelector =
    async () => {
      setPatientListOpen(
        true
      );


      if (
        patientSearch.trim()
        || patientResults.length > 0
      ) {
        return;
      }


      setSearchingPatients(
        true
      );

      setPatientSearchError(
        ""
      );


      try {
        const results =
          await medicalRecordService
            .searchPatients(
              ""
            );


        setPatientResults(
          results
        );
      } catch (
        requestError
      ) {
        setPatientResults(
          []
        );

        setPatientSearchError(
          getErrorMessage(
            requestError
          )
        );
      } finally {
        setSearchingPatients(
          false
        );
      }
    };


  const selectPatient =
    (
      patient:
      PatientLookupResult
    ) => {
      setSelectedPatient(
        patient
      );

      setPatientSearch(
        ""
      );

      setPatientResults(
        []
      );

      setPatientListOpen(
        false
      );

      setPatientSearchError(
        ""
      );

      setError(
        ""
      );
    };


  const changePatient =
    () => {
      setSelectedPatient(
        null
      );

      setPatientSearch(
        ""
      );

      setPatientResults(
        []
      );

      setPatientListOpen(
        false
      );
    };


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


      const exists =
        symptoms.some(
          (
            symptom
          ) =>
            symptom.toLowerCase()
            === value.toLowerCase()
        );


      if (!exists) {
        setSymptoms(
          (
            previous
          ) => [
            ...previous,
            value,
          ]
        );
      }


      setSymptomInput(
        ""
      );
    };


  const removeSymptom =
    (
      index: number
    ) => {
      setSymptoms(
        (
          previous
        ) =>
          previous.filter(
            (
              _,
              currentIndex
            ) =>
              currentIndex !== index
          )
      );
    };


  /*
   * =========================================================
   * TREATMENT PLAN
   * =========================================================
   */
  const addTreatment =
    () => {
      const value =
        treatmentInput.trim();


      if (!value) {
        return;
      }


      setTreatmentPlan(
        (
          previous
        ) => [
          ...previous,
          value,
        ]
      );


      setTreatmentInput(
        ""
      );
    };


  const removeTreatment =
    (
      index: number
    ) => {
      setTreatmentPlan(
        (
          previous
        ) =>
          previous.filter(
            (
              _,
              currentIndex
            ) =>
              currentIndex !== index
          )
      );
    };


  const formValid =
    useMemo(
      () =>
        Boolean(
          selectedPatient?.id
          && hospitalName.trim()
          && visitDate
          && recordType.trim()
          && diagnosis.trim()
          && clinicalSummary.trim()
        ),
      [
        selectedPatient,
        hospitalName,
        visitDate,
        recordType,
        diagnosis,
        clinicalSummary,
      ]
    );


  /*
   * =========================================================
   * SUBMIT
   * =========================================================
   */
  const handleSubmit =
    async (
      event:
      FormEvent<HTMLFormElement>
    ) => {
      event.preventDefault();


      if (!canCreate) {
        setError(
          "Only doctors can create Medical Records."
        );

        return;
      }


      if (!selectedPatient) {
        setError(
          "Please select a patient."
        );

        return;
      }


      if (!formValid) {
        setError(
          "Please complete all required fields."
        );

        return;
      }


      const request:
        MedicalRecordRequest = {
          patientId:
            selectedPatient.id,

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
            consultationNotes.trim()
            || undefined,
        };


      setSubmitting(
        true
      );

      setError(
        ""
      );

      setSuccess(
        ""
      );


      try {
        const created =
          await medicalRecordService
            .createMedicalRecord(
              request
            );


        setSuccess(
          "Medical Record created successfully."
        );


        window.setTimeout(
          () => {
            router.push(
              `/medical-records/${
                encodeURIComponent(
                  created.id
                )
              }`
            );
          },
          600
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
        setSubmitting(
          false
        );
      }
    };


  const backHref =
    selectedPatient
      ? (
        `/medical-records?patientId=${
          encodeURIComponent(
            selectedPatient.id
          )
        }`
      )
      : "/medical-records";


  return (
    <DashboardLayout
      pageTitle="Create Medical Record"
    >
      <div
        className="
          mx-auto
          w-full
          max-w-5xl
          space-y-5
        "
      >
        <div>
          <Link
            href={backHref}
            className="
              inline-flex
              items-center
              gap-2
              text-sm
              font-semibold
              text-blue-600
              hover:text-blue-700
            "
          >
            <ArrowLeft className="h-4 w-4" />

            Back to EHR
          </Link>


          <div
            className="
              mt-4
              flex
              items-center
              gap-3
            "
          >
            <div
              className="
                flex
                h-12
                w-12
                items-center
                justify-center
                rounded-2xl
                bg-blue-50
                text-blue-600
              "
            >
              <ClipboardPlus className="h-6 w-6" />
            </div>

            <div>
              <h1
                className="
                  text-2xl
                  font-bold
                  text-slate-900
                "
              >
                Create Medical Record
              </h1>

              <p
                className="
                  mt-1
                  text-sm
                  text-slate-500
                "
              >
                Record a new patient consultation,
                diagnosis, clinical summary,
                symptoms and treatment plan.
              </p>
            </div>
          </div>
        </div>


        {currentUser && (
          <section
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
              <div
                className="
                  flex
                  h-10
                  w-10
                  items-center
                  justify-center
                  rounded-xl
                  bg-white
                  text-blue-600
                "
              >
                <Stethoscope className="h-5 w-5" />
              </div>

              <div>
                <p
                  className="
                    text-xs
                    font-semibold
                    uppercase
                    text-blue-500
                  "
                >
                  Authenticated Doctor
                </p>

                <p
                  className="
                    mt-1
                    text-sm
                    font-bold
                    text-slate-800
                  "
                >
                  {currentUser.fullName}
                </p>
              </div>
            </div>

            <p
              className="
                mt-3
                text-xs
                text-slate-500
              "
            >
              Doctor identity is taken securely
              from your JWT. It is not entered manually.
            </p>
          </section>
        )}


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
            <AlertCircle className="mt-0.5 h-5 w-5" />

            <p className="text-sm">
              {error}
            </p>
          </div>
        )}


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
            <CheckCircle2 className="h-5 w-5" />

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


        {currentUser
          && !canCreate
          && (
            <section
              className="
                rounded-2xl
                border
                border-slate-200
                bg-white
                p-10
                text-center
              "
            >
              <UserRound
                className="
                  mx-auto
                  h-10
                  w-10
                  text-slate-300
                "
              />

              <h2
                className="
                  mt-4
                  font-bold
                "
              >
                Doctor access required
              </h2>
            </section>
          )
        }


        {canCreate && (
          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >
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
                {/* PATIENT */}
                <div className="md:col-span-2">
                  <label
                    className="
                      mb-1.5
                      block
                      text-sm
                      font-semibold
                    "
                  >
                    Patient
                    <span className="ml-1 text-red-500">
                      *
                    </span>
                  </label>


                  {selectedPatient
                    ? (
                      <div
                        className="
                          rounded-2xl
                          border
                          border-blue-200
                          bg-blue-50/60
                          p-4
                        "
                      >
                        <div
                          className="
                            flex
                            flex-col
                            gap-4
                            sm:flex-row
                            sm:items-center
                            sm:justify-between
                          "
                        >
                          <div
                            className="
                              flex
                              items-start
                              gap-3
                            "
                          >
                            <div
                              className="
                                flex
                                h-11
                                w-11
                                shrink-0
                                items-center
                                justify-center
                                overflow-hidden
                                rounded-xl
                                bg-white
                                text-blue-600
                              "
                            >
                              {selectedPatient.picture
                                ? (
                                  <img
                                    src={selectedPatient.picture}
                                    alt=""
                                    className="
                                      h-full
                                      w-full
                                      object-cover
                                    "
                                  />
                                )
                                : (
                                  <UserCheck className="h-5 w-5" />
                                )
                              }
                            </div>


                            <div>
                              <p
                                className="
                                  text-xs
                                  font-semibold
                                  uppercase
                                  text-blue-500
                                "
                              >
                                Selected Patient
                              </p>

                              <p
                                className="
                                  mt-1
                                  font-bold
                                  text-slate-900
                                "
                              >
                                {selectedPatient.fullName}
                              </p>

                              <p
                                className="
                                  mt-1
                                  break-all
                                  text-xs
                                  text-slate-500
                                "
                              >
                                Patient ID:{" "}
                                {selectedPatient.id}
                              </p>


                              <div
                                className="
                                  mt-2
                                  flex
                                  flex-wrap
                                  gap-2
                                "
                              >
                                {selectedPatient.dateOfBirth && (
                                  <span
                                    className="
                                      rounded-full
                                      bg-white
                                      px-2.5
                                      py-1
                                      text-xs
                                    "
                                  >
                                    DOB:{" "}
                                    {selectedPatient.dateOfBirth}
                                  </span>
                                )}

                                {selectedPatient.gender && (
                                  <span
                                    className="
                                      rounded-full
                                      bg-white
                                      px-2.5
                                      py-1
                                      text-xs
                                    "
                                  >
                                    {selectedPatient.gender}
                                  </span>
                                )}

                                {selectedPatient.bloodGroup && (
                                  <span
                                    className="
                                      rounded-full
                                      bg-white
                                      px-2.5
                                      py-1
                                      text-xs
                                      font-semibold
                                      text-rose-600
                                    "
                                  >
                                    Blood:{" "}
                                    {selectedPatient.bloodGroup}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>


                          <button
                            type="button"
                            onClick={changePatient}
                            className="
                              rounded-xl
                              border
                              border-blue-200
                              bg-white
                              px-4
                              py-2.5
                              text-sm
                              font-semibold
                              text-blue-700
                            "
                          >
                            Change Patient
                          </button>
                        </div>
                      </div>
                    )
                    : (
                      <div className="relative">
                        <div className="relative">
                          <Search
                            className="
                              absolute
                              left-3
                              top-1/2
                              h-4
                              w-4
                              -translate-y-1/2
                              text-slate-400
                            "
                          />

                          <input
                            type="search"
                            value={patientSearch}
                            onFocus={
                              () => {
                                void openPatientSelector();
                              }
                            }
                            onChange={
                              (
                                event
                              ) => {
                                setPatientSearch(
                                  event.target.value
                                );

                                setPatientListOpen(
                                  true
                                );
                              }
                            }
                            placeholder="Search by patient name or exact Patient ID..."
                            autoComplete="off"
                            className="
                              w-full
                              rounded-xl
                              border
                              border-slate-200
                              py-3
                              pl-10
                              pr-10
                              text-sm
                              outline-none
                              focus:border-blue-500
                              focus:ring-2
                              focus:ring-blue-100
                            "
                          />

                          {searchingPatients && (
                            <Loader2
                              className="
                                absolute
                                right-3
                                top-1/2
                                h-4
                                w-4
                                -translate-y-1/2
                                animate-spin
                                text-blue-600
                              "
                            />
                          )}
                        </div>


                        <p
                          className="
                            mt-2
                            text-xs
                            text-slate-500
                          "
                        >
                          Click the field to browse registered
                          patients, or type at least 2 characters.
                        </p>


                        {patientSearchError && (
                          <p
                            className="
                              mt-2
                              text-xs
                              text-red-600
                            "
                          >
                            {patientSearchError}
                          </p>
                        )}


                        {patientListOpen && (
                          <div
                            className="
                              absolute
                              left-0
                              right-0
                              z-30
                              mt-2
                              max-h-80
                              overflow-y-auto
                              rounded-2xl
                              border
                              border-slate-200
                              bg-white
                              p-2
                              shadow-xl
                            "
                          >
                            {searchingPatients
                              && patientResults.length === 0
                              ? (
                                <div
                                  className="
                                    flex
                                    items-center
                                    justify-center
                                    gap-2
                                    p-8
                                    text-sm
                                    text-slate-500
                                  "
                                >
                                  <Loader2
                                    className="
                                      h-4
                                      w-4
                                      animate-spin
                                    "
                                  />

                                  Loading patients...
                                </div>
                              )
                              : patientResults.length === 0
                                ? (
                                  <div
                                    className="
                                      p-8
                                      text-center
                                    "
                                  >
                                    <UserRound
                                      className="
                                        mx-auto
                                        h-8
                                        w-8
                                        text-slate-300
                                      "
                                    />

                                    <p
                                      className="
                                        mt-2
                                        text-sm
                                        font-semibold
                                        text-slate-700
                                      "
                                    >
                                      No patients found
                                    </p>
                                  </div>
                                )
                                : (
                                  <div className="space-y-1">
                                    {patientResults.map(
                                      (
                                        patient
                                      ) => (
                                        <button
                                          key={patient.id}
                                          type="button"
                                          onClick={
                                            () =>
                                              selectPatient(
                                                patient
                                              )
                                          }
                                          className="
                                            flex
                                            w-full
                                            items-start
                                            gap-3
                                            rounded-xl
                                            p-3
                                            text-left
                                            transition
                                            hover:bg-blue-50
                                          "
                                        >
                                          <div
                                            className="
                                              flex
                                              h-10
                                              w-10
                                              shrink-0
                                              items-center
                                              justify-center
                                              overflow-hidden
                                              rounded-xl
                                              bg-slate-100
                                              text-blue-600
                                            "
                                          >
                                            {patient.picture
                                              ? (
                                                <img
                                                  src={patient.picture}
                                                  alt=""
                                                  className="
                                                    h-full
                                                    w-full
                                                    object-cover
                                                  "
                                                />
                                              )
                                              : (
                                                <UserRound
                                                  className="
                                                    h-5
                                                    w-5
                                                  "
                                                />
                                              )
                                            }
                                          </div>


                                          <div className="min-w-0">
                                            <p
                                              className="
                                                truncate
                                                text-sm
                                                font-bold
                                                text-slate-900
                                              "
                                            >
                                              {patient.fullName}
                                            </p>

                                            <p
                                              className="
                                                mt-1
                                                break-all
                                                text-xs
                                                text-slate-500
                                              "
                                            >
                                              Patient ID:{" "}
                                              {patient.id}
                                            </p>

                                            <div
                                              className="
                                                mt-1
                                                flex
                                                flex-wrap
                                                gap-2
                                                text-[11px]
                                                text-slate-500
                                              "
                                            >
                                              {patient.dateOfBirth && (
                                                <span>
                                                  DOB:{" "}
                                                  {patient.dateOfBirth}
                                                </span>
                                              )}

                                              {patient.gender && (
                                                <span>
                                                  {patient.gender}
                                                </span>
                                              )}

                                              {patient.bloodGroup && (
                                                <span
                                                  className="
                                                    text-rose-600
                                                  "
                                                >
                                                  Blood:{" "}
                                                  {patient.bloodGroup}
                                                </span>
                                              )}
                                            </div>
                                          </div>
                                        </button>
                                      )
                                    )}
                                  </div>
                                )
                            }
                          </div>
                        )}
                      </div>
                    )
                  }
                </div>


                <div>
                  <label
                    className="
                      mb-1.5
                      block
                      text-sm
                      font-semibold
                    "
                  >
                    Visit Date *
                  </label>

                  <input
                    type="date"
                    value={visitDate}
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


                <div>
                  <label
                    className="
                      mb-1.5
                      block
                      text-sm
                      font-semibold
                    "
                  >
                    Hospital / Clinic *
                  </label>

                  <input
                    type="text"
                    value={hospitalName}
                    onChange={
                      (
                        event
                      ) =>
                        setHospitalName(
                          event.target.value
                        )
                    }
                    placeholder="HealthBridge Hospital"
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
                    "
                  >
                    Record Type *
                  </label>

                  <select
                    value={recordType}
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


            {/* CLINICAL DETAILS */}
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
                "
              >
                Clinical Details
              </h2>


              <div className="mt-5 space-y-4">
                <div>
                  <label
                    className="
                      mb-1.5
                      block
                      text-sm
                      font-semibold
                    "
                  >
                    Primary Diagnosis *
                  </label>

                  <input
                    value={diagnosis}
                    onChange={
                      (
                        event
                      ) =>
                        setDiagnosis(
                          event.target.value
                        )
                    }
                    placeholder="e.g. Hypertension"
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
                    "
                  >
                    Clinical Summary *
                  </label>

                  <textarea
                    rows={4}
                    value={clinicalSummary}
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
              <h2 className="text-lg font-bold">
                Symptoms
              </h2>

              <div
                className="
                  mt-4
                  flex
                  gap-2
                "
              >
                <input
                  value={symptomInput}
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
                  "
                />

                <button
                  type="button"
                  onClick={addSymptom}
                  className="
                    rounded-xl
                    bg-blue-50
                    px-4
                    text-blue-700
                  "
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>


              <div
                className="
                  mt-3
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
                      key={`${symptom}-${index}`}
                      className="
                        inline-flex
                        items-center
                        gap-2
                        rounded-full
                        bg-rose-50
                        px-3
                        py-1.5
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
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  )
                )}
              </div>
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
              <h2 className="text-lg font-bold">
                Treatment Plan
              </h2>

              <div
                className="
                  mt-4
                  flex
                  gap-2
                "
              >
                <input
                  value={treatmentInput}
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

                        addTreatment();
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
                  "
                />

                <button
                  type="button"
                  onClick={addTreatment}
                  className="
                    rounded-xl
                    bg-emerald-50
                    px-4
                    text-emerald-700
                  "
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>


              <div className="mt-3 space-y-2">
                {treatmentPlan.map(
                  (
                    item,
                    index
                  ) => (
                    <div
                      key={`${item}-${index}`}
                      className="
                        flex
                        items-start
                        justify-between
                        gap-3
                        rounded-xl
                        bg-emerald-50
                        p-3
                        text-sm
                        text-emerald-800
                      "
                    >
                      <span>
                        {index + 1}. {item}
                      </span>

                      <button
                        type="button"
                        onClick={
                          () =>
                            removeTreatment(
                              index
                            )
                        }
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  )
                )}
              </div>
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
              <h2 className="text-lg font-bold">
                Consultation Notes
              </h2>

              <textarea
                rows={6}
                value={consultationNotes}
                onChange={
                  (
                    event
                  ) =>
                    setConsultationNotes(
                      event.target.value
                    )
                }
                placeholder="Clinical observations, advice and follow-up notes..."
                className="
                  mt-4
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
            </section>


            <div
              className="
                flex
                justify-end
              "
            >
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
                  py-3
                  text-sm
                  font-semibold
                  text-white
                  transition
                  hover:bg-blue-700
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                "
              >
                {submitting && (
                  <Loader2
                    className="
                      h-4
                      w-4
                      animate-spin
                    "
                  />
                )}

                {submitting
                  ? "Creating..."
                  : "Create Medical Record"
                }
              </button>
            </div>
          </form>
        )}
      </div>
    </DashboardLayout>
  );
}