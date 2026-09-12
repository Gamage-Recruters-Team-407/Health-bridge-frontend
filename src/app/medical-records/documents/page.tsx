"use client";

import Link from "next/link";
import {
  ChangeEvent,
  FormEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  AlertCircle,
  Archive,
  ArrowLeft,
  CheckCircle2,
  FileText,
  FolderOpen,
  Loader2,
  RefreshCw,
  Replace,
  Search,
  Upload,
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
  MedicalDocument,
  MedicalRecord,
  PatientEhrHistory,
} from "@/types/medicalRecord";


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
      requestError
        .response
        ?.status === 403
    ) {
      return (
        "You do not have permission "
        + "to perform this document action."
      );
    }


    if (
      requestError
        .response
        ?.status === 404
    ) {
      return (
        "The requested medical "
        + "document was not found."
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
    "Unable to complete the "
    + "medical document request."
  );
}


export default function MedicalDocumentsPage() {

  const [
    user,
    setUser,
  ] =
    useState<AuthUser | null>(
      null
    );


  const [
    history,
    setHistory,
  ] =
    useState<PatientEhrHistory | null>(
      null
    );


  const [
    activePatientId,
    setActivePatientId,
  ] =
    useState("");


  const [
    patientIdInput,
    setPatientIdInput,
  ] =
    useState("");


  const [
    loading,
    setLoading,
  ] =
    useState(false);


  const [
    actionLoading,
    setActionLoading,
  ] =
    useState<string | null>(
      null
    );


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


  /*
   * ---------------------------------------------------------
   * UPLOAD FORM
   * ---------------------------------------------------------
   */

  const [
    uploadFile,
    setUploadFile,
  ] =
    useState<File | null>(
      null
    );


  const [
    uploadMedicalRecordId,
    setUploadMedicalRecordId,
  ] =
    useState("");


  const [
    uploadDocumentType,
    setUploadDocumentType,
  ] =
    useState("");


  const [
    uploadDescription,
    setUploadDescription,
  ] =
    useState("");


  const uploadFileInputRef =
    useRef<HTMLInputElement | null>(
      null
    );


  const canSearchPatient =
    user?.role === "DOCTOR"
    || user?.role === "ADMIN"
    || user?.role === "SUPER_ADMIN";


  const canUpload =
    user?.role === "DOCTOR";


  const canArchive =
    user?.role === "DOCTOR"
    || user?.role === "ADMIN"
    || user?.role === "SUPER_ADMIN";


  /*
   * Doctor may upload documents
   * only to MedicalRecords owned
   * by that authenticated doctor.
   */
  const doctorOwnedMedicalRecords =
    useMemo(
      () => {

        if (
          !history
          || !user
          || user.role !== "DOCTOR"
        ) {
          return [];
        }


        return history
          .medicalRecords
          .filter(
            (
              record:
              MedicalRecord
            ) =>
              record.doctorId
              === user.id
          );

      },
      [
        history,
        user,
      ]
    );


  const documents =
    useMemo(
      () => {

        if (!history) {
          return [];
        }


        return [
          ...history.documents,
        ].sort(
          (
            first,
            second
          ) =>
            new Date(
              second.uploadedAt
            ).getTime()
            -
            new Date(
              first.uploadedAt
            ).getTime()
        );

      },
      [
        history,
      ]
    );


  /*
   * ---------------------------------------------------------
   * LOAD PATIENT DOCUMENT DATA
   * ---------------------------------------------------------
   */
  const loadDocuments =
    async (
      patientId: string
    ) => {

      const normalized =
        patientId.trim();


      if (!normalized) {

        setError(
          "Patient ID is required."
        );

        return;
      }


      setLoading(true);
      setError("");
      setSuccess("");


      try {

        const response =
          await medicalRecordService
            .getPatientEhrHistory(
              normalized
            );


        setHistory(
          response
        );


        setActivePatientId(
          normalized
        );


        setPatientIdInput(
          normalized
        );


      } catch (
        requestError
      ) {

        setHistory(
          null
        );


        setError(
          getErrorMessage(
            requestError
          )
        );


      } finally {

        setLoading(false);
      }
    };


  /*
   * ---------------------------------------------------------
   * INITIAL USER
   * ---------------------------------------------------------
   */
  useEffect(
    () => {

      const storedUser =
        getStoredUser();


      if (!storedUser) {

        setError(
          "Please login to access "
          + "medical documents."
        );

        return;
      }


      setUser(
        storedUser
      );


      /*
       * PATIENT:
       * load own documents.
       */
      if (
        storedUser.role
        === "PATIENT"
      ) {

        setPatientIdInput(
          storedUser.id
        );


        void loadDocuments(
          storedUser.id
        );


        return;
      }


      /*
       * DOCTOR / ADMIN:
       *
       * Supports:
       * /medical-records/documents?patientId=...
       */
      const parameters =
        new URLSearchParams(
          window.location.search
        );


      const patientIdFromUrl =
        parameters
          .get("patientId")
          ?.trim();


      if (
        patientIdFromUrl
      ) {

        setPatientIdInput(
          patientIdFromUrl
        );


        void loadDocuments(
          patientIdFromUrl
        );
      }

    },
    []
  );


  /*
   * Auto select first doctor-owned
   * MedicalRecord for upload.
   */
  useEffect(
    () => {

      if (
        doctorOwnedMedicalRecords
          .length === 0
      ) {

        setUploadMedicalRecordId("");

        return;
      }


      const currentStillExists =
        doctorOwnedMedicalRecords
          .some(
            (
              record
            ) =>
              record.id
              === uploadMedicalRecordId
          );


      if (
        !currentStillExists
      ) {

        setUploadMedicalRecordId(
          doctorOwnedMedicalRecords[0]
            .id
        );
      }

    },
    [
      doctorOwnedMedicalRecords,
      uploadMedicalRecordId,
    ]
  );


  /*
   * ---------------------------------------------------------
   * SEARCH
   * ---------------------------------------------------------
   */
  const handleSearch =
    (
      event: FormEvent
    ) => {

      event.preventDefault();

      void loadDocuments(
        patientIdInput
      );
    };


  /*
   * ---------------------------------------------------------
   * UPLOAD
   * ---------------------------------------------------------
   */
  const handleUpload =
    async (
      event: FormEvent
    ) => {

      event.preventDefault();


      if (
        !activePatientId
      ) {

        setError(
          "Please load a patient first."
        );

        return;
      }


      if (
        !uploadMedicalRecordId
      ) {

        setError(
          "Please select a Medical Record."
        );

        return;
      }


      if (
        !uploadFile
      ) {

        setError(
          "Please select a file."
        );

        return;
      }


      if (
        !uploadDocumentType.trim()
      ) {

        setError(
          "Document type is required."
        );

        return;
      }


      setActionLoading(
        "upload"
      );

      setError("");
      setSuccess("");


      try {

        await medicalRecordService
          .uploadDocument(
            uploadFile,
            uploadMedicalRecordId,
            activePatientId,
            uploadDocumentType.trim(),
            uploadDescription.trim()
              || undefined
          );


        setSuccess(
          "Medical document uploaded successfully."
        );


        setUploadFile(
          null
        );

        setUploadDocumentType(
          ""
        );

        setUploadDescription(
          ""
        );


        if (
          uploadFileInputRef.current
        ) {
          uploadFileInputRef
            .current
            .value = "";
        }


        await loadDocuments(
          activePatientId
        );


        setSuccess(
          "Medical document uploaded successfully."
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

        setActionLoading(
          null
        );
      }
    };


  /*
   * ---------------------------------------------------------
   * REPLACE FILE
   * ---------------------------------------------------------
   */
  const handleReplaceDocument =
    async (
      document:
      MedicalDocument,
      event:
      ChangeEvent<HTMLInputElement>
    ) => {

      const file =
        event
          .target
          .files?.[0];


      if (!file) {
        return;
      }


      setActionLoading(
        `replace-${document.id}`
      );

      setError("");
      setSuccess("");


      try {

        await medicalRecordService
          .replaceDocument(
            document.id,
            file,
            document.description
              || undefined
          );


        await loadDocuments(
          activePatientId
        );


        setSuccess(
          "Document file replaced successfully. "
          + "A new document version was created."
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

        event.target.value = "";

        setActionLoading(
          null
        );
      }
    };


  /*
   * ---------------------------------------------------------
   * ARCHIVE
   * ---------------------------------------------------------
   */
  const handleArchive =
    async (
      document:
      MedicalDocument
    ) => {

      const confirmed =
        window.confirm(
          `Archive "${document.fileName}"?`
        );


      if (!confirmed) {
        return;
      }


      setActionLoading(
        `archive-${document.id}`
      );

      setError("");
      setSuccess("");


      try {

        await medicalRecordService
          .archiveDocument(
            document.id
          );


        await loadDocuments(
          activePatientId
        );


        setSuccess(
          "Medical document archived successfully."
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

        setActionLoading(
          null
        );
      }
    };


  const backHref =
    activePatientId
    && canSearchPatient
      ? (
        `/medical-records?patientId=${
          encodeURIComponent(
            activePatientId
          )
        }`
      )
      : "/medical-records";


  return (
    <DashboardLayout
      pageTitle="Medical Documents"
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
            sm:items-center
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
              Medical Documents
            </h1>


            <p
              className="
                mt-1
                text-sm
                text-slate-500
              "
            >
              Clinical reports,
              scans and supporting
              patient documents.
            </p>

          </div>


          {activePatientId && (

            <button
              type="button"
              onClick={
                () =>
                  void loadDocuments(
                    activePatientId
                  )
              }
              disabled={
                loading
              }
              className="
                inline-flex
                items-center
                justify-center
                gap-2
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
                disabled:opacity-50
              "
            >

              {loading
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
                  <RefreshCw
                    className="
                      h-4
                      w-4
                    "
                  />
                )
              }

              Refresh
            </button>
          )}

        </div>


        {/* ==============================================
            PATIENT SEARCH
            ============================================== */}
        {canSearchPatient && (

          <form
            onSubmit={
              handleSearch
            }
            className="
              rounded-2xl
              border
              border-blue-100
              bg-blue-50/60
              p-4
            "
          >

            <label
              className="
                mb-2
                block
                text-xs
                font-bold
                uppercase
                tracking-wide
                text-slate-600
              "
            >
              Patient Document Lookup
            </label>


            <div
              className="
                flex
                flex-col
                gap-3
                sm:flex-row
              "
            >

              <div
                className="
                  relative
                  flex-1
                "
              >

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
                  type="text"
                  value={
                    patientIdInput
                  }
                  onChange={
                    (
                      event
                    ) =>
                      setPatientIdInput(
                        event.target.value
                      )
                  }
                  placeholder="Enter patient User ID"
                  className="
                    w-full
                    rounded-xl
                    border
                    border-slate-200
                    bg-white
                    py-2.5
                    pl-10
                    pr-4
                    text-sm
                    outline-none
                    transition
                    focus:border-blue-500
                    focus:ring-2
                    focus:ring-blue-100
                  "
                />

              </div>


              <button
                type="submit"
                disabled={
                  loading
                  || !patientIdInput
                    .trim()
                }
                className="
                  inline-flex
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  bg-blue-600
                  px-5
                  py-2.5
                  text-sm
                  font-semibold
                  text-white
                  transition
                  hover:bg-blue-700
                  disabled:opacity-50
                "
              >

                {loading
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
                    <Search
                      className="
                        h-4
                        w-4
                      "
                    />
                  )
                }

                Load Documents
              </button>

            </div>

          </form>
        )}


        {/* ==============================================
            SUCCESS
            ============================================== */}
        {success && (

          <div
            className="
              flex
              items-start
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
                mt-0.5
                h-5
                w-5
                shrink-0
              "
            />

            <p
              className="
                text-sm
                font-medium
              "
            >
              {success}
            </p>

          </div>
        )}


        {/* ==============================================
            ERROR
            ============================================== */}
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
                Document request failed
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


        {/* ==============================================
            INITIAL LOADING
            ============================================== */}
        {loading
          && !history
          && (
            <div
              className="
                flex
                min-h-64
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
                  Loading medical
                  documents...
                </p>
              </div>
            </div>
          )
        }


        {history && (
          <>
            {/* ==========================================
                PATIENT SUMMARY
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
                  gap-4
                  sm:flex-row
                  sm:items-center
                  sm:justify-between
                "
              >

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
                      history.patientId
                    }
                  </p>
                </div>


                <div
                  className="
                    flex
                    items-center
                    gap-3
                  "
                >

                  <div
                    className="
                      rounded-xl
                      bg-blue-50
                      px-4
                      py-3
                      text-center
                    "
                  >
                    <p
                      className="
                        text-xl
                        font-bold
                        text-blue-700
                      "
                    >
                      {
                        documents.length
                      }
                    </p>

                    <p
                      className="
                        text-xs
                        text-blue-600
                      "
                    >
                      Active Documents
                    </p>
                  </div>

                </div>

              </div>

            </section>


            {/* ==========================================
                DOCTOR UPLOAD FORM
                ========================================== */}
            {canUpload && (

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
                    items-start
                    gap-3
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
                      rounded-xl
                      bg-blue-50
                      text-blue-600
                    "
                  >
                    <Upload
                      className="
                        h-5
                        w-5
                      "
                    />
                  </div>


                  <div>
                    <h2
                      className="
                        font-bold
                        text-slate-900
                      "
                    >
                      Upload Medical Document
                    </h2>

                    <p
                      className="
                        mt-1
                        text-sm
                        text-slate-500
                      "
                    >
                      Upload a clinical file
                      to one of your active
                      Medical Records for
                      this patient.
                    </p>
                  </div>

                </div>


                {doctorOwnedMedicalRecords
                  .length === 0
                  ? (

                    <div
                      className="
                        mt-5
                        rounded-xl
                        border
                        border-amber-200
                        bg-amber-50
                        p-4
                        text-sm
                        text-amber-700
                      "
                    >
                      You do not own an active
                      Medical Record for this
                      patient. Create or use
                      your own Medical Record
                      before uploading a
                      document.
                    </div>

                  )
                  : (

                    <form
                      onSubmit={
                        handleUpload
                      }
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
                            text-xs
                            font-semibold
                            text-slate-600
                          "
                        >
                          Medical Record
                        </label>

                        <select
                          value={
                            uploadMedicalRecordId
                          }
                          onChange={
                            (
                              event
                            ) =>
                              setUploadMedicalRecordId(
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
                          {doctorOwnedMedicalRecords
                            .map(
                              (
                                record
                              ) => (

                                <option
                                  key={
                                    record.id
                                  }
                                  value={
                                    record.id
                                  }
                                >
                                  {formatDate(
                                    record.visitDate
                                  )}
                                  {" - "}
                                  {
                                    record.recordType
                                  }
                                  {" - "}
                                  {
                                    record.diagnosis
                                  }
                                </option>
                              )
                            )}
                        </select>
                      </div>


                      <div>
                        <label
                          className="
                            mb-1.5
                            block
                            text-xs
                            font-semibold
                            text-slate-600
                          "
                        >
                          Document Type
                        </label>

                        <input
                          type="text"
                          value={
                            uploadDocumentType
                          }
                          onChange={
                            (
                              event
                            ) =>
                              setUploadDocumentType(
                                event.target.value
                              )
                          }
                          placeholder="e.g. Scan, Report, Discharge Summary"
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
                            text-xs
                            font-semibold
                            text-slate-600
                          "
                        >
                          File
                        </label>

                        <input
                          ref={
                            uploadFileInputRef
                          }
                          type="file"
                          onChange={
                            (
                              event
                            ) =>
                              setUploadFile(
                                event
                                  .target
                                  .files?.[0]
                                ?? null
                              )
                          }
                          className="
                            block
                            w-full
                            rounded-xl
                            border
                            border-slate-200
                            bg-white
                            px-3
                            py-2
                            text-sm
                            text-slate-600
                            file:mr-3
                            file:rounded-lg
                            file:border-0
                            file:bg-blue-50
                            file:px-3
                            file:py-1.5
                            file:text-xs
                            file:font-semibold
                            file:text-blue-700
                          "
                        />
                      </div>


                      <div>
                        <label
                          className="
                            mb-1.5
                            block
                            text-xs
                            font-semibold
                            text-slate-600
                          "
                        >
                          Description
                        </label>

                        <input
                          type="text"
                          value={
                            uploadDescription
                          }
                          onChange={
                            (
                              event
                            ) =>
                              setUploadDescription(
                                event.target.value
                              )
                          }
                          placeholder="Optional description"
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
                        <button
                          type="submit"
                          disabled={
                            actionLoading
                            === "upload"
                            || !uploadFile
                            || !uploadMedicalRecordId
                            || !uploadDocumentType
                              .trim()
                          }
                          className="
                            inline-flex
                            items-center
                            justify-center
                            gap-2
                            rounded-xl
                            bg-blue-600
                            px-5
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

                          {actionLoading
                            === "upload"
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
                              <Upload
                                className="
                                  h-4
                                  w-4
                                "
                              />
                            )
                          }

                          Upload Document
                        </button>
                      </div>

                    </form>
                  )
                }

              </section>
            )}


            {/* ==========================================
                DOCUMENT LIST
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

              <div>
                <h2
                  className="
                    text-lg
                    font-bold
                    text-slate-900
                  "
                >
                  Patient Documents
                </h2>

                <p
                  className="
                    mt-1
                    text-sm
                    text-slate-500
                  "
                >
                  Active clinical documents
                  currently linked to the
                  patient EHR.
                </p>
              </div>


              {documents.length === 0
                ? (

                  <div
                    className="
                      mt-6
                      rounded-xl
                      border
                      border-dashed
                      border-slate-200
                      px-5
                      py-12
                      text-center
                    "
                  >

                    <FolderOpen
                      className="
                        mx-auto
                        h-9
                        w-9
                        text-slate-300
                      "
                    />

                    <p
                      className="
                        mt-3
                        text-sm
                        font-semibold
                        text-slate-700
                      "
                    >
                      No medical documents
                    </p>

                    <p
                      className="
                        mt-1
                        text-xs
                        text-slate-500
                      "
                    >
                      No active documents
                      are currently available.
                    </p>

                  </div>

                )
                : (

                  <div
                    className="
                      mt-5
                      grid
                      gap-4
                      md:grid-cols-2
                      xl:grid-cols-3
                    "
                  >

                    {documents.map(
                      (
                        document
                      ) => {

                        const doctorCanModify =
                          user?.role === "DOCTOR"
                          && history
                            .medicalRecords
                            .some(
                              (
                                record
                              ) =>
                                record.id
                                === document
                                  .medicalRecordId
                                && record.doctorId
                                === user.id
                            );


                        return (

                          <article
                            key={
                              document.id
                            }
                            className="
                              flex
                              min-h-64
                              flex-col
                              rounded-2xl
                              border
                              border-slate-200
                              bg-slate-50/60
                              p-4
                              transition
                              hover:border-blue-200
                              hover:bg-white
                              hover:shadow-sm
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

                              <div
                                className="
                                  flex
                                  h-11
                                  w-11
                                  items-center
                                  justify-center
                                  rounded-xl
                                  bg-blue-100
                                  text-blue-600
                                "
                              >
                                <FileText
                                  className="
                                    h-5
                                    w-5
                                  "
                                />
                              </div>


                              <span
                                className="
                                  rounded-full
                                  bg-emerald-50
                                  px-2.5
                                  py-1
                                  text-[11px]
                                  font-semibold
                                  text-emerald-700
                                "
                              >
                                {
                                  document.status
                                }
                              </span>

                            </div>


                            <div
                              className="
                                mt-4
                                flex-1
                              "
                            >

                              <h3
                                title={
                                  document.fileName
                                }
                                className="
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


                              {document
                                .description
                                && (
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
                                )
                              }

                            </div>


                            <div
                              className="
                                mt-4
                                border-t
                                border-slate-200
                                pt-3
                              "
                            >

                              <div
                                className="
                                  flex
                                  items-center
                                  justify-between
                                  gap-3
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


                              <p
                                className="
                                  mt-1
                                  text-[11px]
                                  text-slate-400
                                "
                              >
                                Uploaded{" "}
                                {formatDate(
                                  document.uploadedAt
                                )}
                              </p>


                              <div
                                className="
                                  mt-4
                                  flex
                                  flex-wrap
                                  gap-2
                                "
                              >

                                <a
                                  href={
                                    document.fileUrl
                                  }
                                  target="_blank"
                                  rel="noreferrer"
                                  className="
                                    inline-flex
                                    items-center
                                    gap-1.5
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
                                  <FileText
                                    className="
                                      h-3.5
                                      w-3.5
                                    "
                                  />

                                  Open
                                </a>


                                {doctorCanModify && (
                                  <label
                                    className="
                                      inline-flex
                                      cursor-pointer
                                      items-center
                                      gap-1.5
                                      rounded-lg
                                      border
                                      border-slate-200
                                      bg-white
                                      px-3
                                      py-2
                                      text-xs
                                      font-semibold
                                      text-slate-700
                                      transition
                                      hover:border-blue-300
                                      hover:text-blue-600
                                    "
                                  >
                                    {actionLoading
                                      === `replace-${document.id}`
                                      ? (
                                        <Loader2
                                          className="
                                            h-3.5
                                            w-3.5
                                            animate-spin
                                          "
                                        />
                                      )
                                      : (
                                        <Replace
                                          className="
                                            h-3.5
                                            w-3.5
                                          "
                                        />
                                      )
                                    }

                                    Replace

                                    <input
                                      type="file"
                                      className="hidden"
                                      disabled={
                                        actionLoading
                                        === `replace-${document.id}`
                                      }
                                      onChange={
                                        (
                                          event
                                        ) =>
                                          void handleReplaceDocument(
                                            document,
                                            event
                                          )
                                      }
                                    />
                                  </label>
                                )}


                                {canArchive
                                  && (
                                    user?.role
                                    !== "DOCTOR"
                                    || doctorCanModify
                                  )
                                  && (
                                    <button
                                      type="button"
                                      onClick={
                                        () =>
                                          void handleArchive(
                                            document
                                          )
                                      }
                                      disabled={
                                        actionLoading
                                        === `archive-${document.id}`
                                      }
                                      className="
                                        inline-flex
                                        items-center
                                        gap-1.5
                                        rounded-lg
                                        border
                                        border-amber-200
                                        bg-amber-50
                                        px-3
                                        py-2
                                        text-xs
                                        font-semibold
                                        text-amber-700
                                        transition
                                        hover:bg-amber-100
                                        disabled:opacity-50
                                      "
                                    >

                                      {actionLoading
                                        === `archive-${document.id}`
                                        ? (
                                          <Loader2
                                            className="
                                              h-3.5
                                              w-3.5
                                              animate-spin
                                            "
                                          />
                                        )
                                        : (
                                          <Archive
                                            className="
                                              h-3.5
                                              w-3.5
                                            "
                                          />
                                        )
                                      }

                                      Archive
                                    </button>
                                  )
                                }

                              </div>

                            </div>

                          </article>
                        );
                      }
                    )}

                  </div>
                )
              }

            </section>
          </>
        )}


        {/* ==============================================
            DOCTOR / ADMIN EMPTY STATE
            ============================================== */}
        {!loading
          && !history
          && !error
          && canSearchPatient
          && (

            <div
              className="
                flex
                min-h-64
                items-center
                justify-center
                rounded-2xl
                border
                border-dashed
                border-slate-300
                bg-white
                p-8
                text-center
              "
            >

              <div>
                <FolderOpen
                  className="
                    mx-auto
                    h-9
                    w-9
                    text-slate-300
                  "
                />

                <p
                  className="
                    mt-3
                    text-sm
                    font-semibold
                    text-slate-700
                  "
                >
                  Select a patient
                </p>

                <p
                  className="
                    mt-1
                    text-xs
                    text-slate-500
                  "
                >
                  Enter a patient User ID
                  to view their medical
                  documents.
                </p>
              </div>

            </div>
          )
        }

      </div>

    </DashboardLayout>
  );
}