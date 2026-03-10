/**
 * AppContext.jsx
 * Centralized data store for the Globalisor platform.
 * All portals read from and write to this shared state.
 */

import React, { createContext, useContext, useState, useCallback } from 'react';
import {
    USERS, APPLICATIONS, KYC_RECORDS, DOCUMENTS,
    STAFF_ASSIGNMENTS, ACRA_SUBMISSIONS_SEED,
    NOTIFICATIONS_SEED, ACTIVITY_LOGS_SEED, FOLLOWUPS_SEED,
    COMPANIES, DIRECTORS, SHAREHOLDERS, COMPLIANCE_EVENTS, VAULT_DOCUMENTS,
} from './seedData.js';

// ─── Context ─────────────────────────────────────────────────────────────────

const AppContext = createContext(null);

export function AppProvider({ children }) {
    const [db, setDb] = useState({
        users: USERS,
        applications: APPLICATIONS,
        kycRecords: KYC_RECORDS,
        documents: DOCUMENTS,
        staffAssignments: STAFF_ASSIGNMENTS,
        notifications: NOTIFICATIONS_SEED,
        activityLogs: ACTIVITY_LOGS_SEED,
        followups: FOLLOWUPS_SEED,
        acraSubmissions: ACRA_SUBMISSIONS_SEED,
        companies: COMPANIES,
        directors: DIRECTORS,
        shareholders: SHAREHOLDERS,
        complianceEvents: COMPLIANCE_EVENTS,
        vaultDocuments: VAULT_DOCUMENTS,
        statusHistory: [],
    });

    // ── Internal helpers ──────────────────────────────────────────────────────

    const now = () => new Date().toISOString().slice(0, 16).replace('T', ' ');
    const uid = () => 'ID-' + Math.random().toString(36).slice(2, 9).toUpperCase();

    /** Push a notification to a user */
    const _notify = (state, user_id, application_id, title, message, type) => ({
        ...state,
        notifications: [
            { notification_id: uid(), user_id, application_id, title, message, notification_type: type, is_read: false, created_at: now() },
            ...state.notifications,
        ],
    });

    /** Append an activity log entry */
    const _log = (state, user_id, application_id, action_type, desc, old_v, new_v) => ({
        ...state,
        activityLogs: [
            { log_id: uid(), user_id, application_id, action_type, action_description: desc, old_value: old_v, new_value: new_v, created_at: now() },
            ...state.activityLogs,
        ],
    });

    // ── PUBLIC API ────────────────────────────────────────────────────────────

    /**
     * CLIENT submits a new application.
     * Mirrors: INSERT applications → notify admin → log audit
     */
    const submitApplication = useCallback((clientUserId, formData) => {
        const appId = 'APP-' + Date.now().toString().slice(-4);
        const ts = now();
        setDb(prev => {
            let s = {
                ...prev,
                applications: [...prev.applications, {
                    application_id: appId,
                    client_user_id: clientUserId,
                    assigned_staff_id: null,
                    application_type: 'Company Incorporation',
                    business_name: formData.businessName,
                    business_type: formData.businessType,
                    nature_of_business: formData.natureOfBusiness,
                    registered_address: formData.registeredAddress,
                    share_capital: Number(formData.shareCapital) || 1000,
                    share_currency: formData.currency || 'SGD',
                    status: 'New',
                    priority: 'Normal',
                    acra_ref_number: null,
                    submitted_at: ts,
                    completed_at: null,
                    created_at: ts,
                    updated_at: ts,
                }],
            };
            // Notify all admins
            const admins = prev.users.filter(u => u.role === 'admin');
            admins.forEach(a => {
                s = _notify(s, a.user_id, appId, 'New Application ✉️', `${formData.businessName} submitted by client.`, 'Application Submitted');
            });
            s = _log(s, clientUserId, appId, 'Application Created', `Client submitted ${formData.businessName}`, null, { status: 'New' });
            return s;
        });
        return appId;
    }, []);

    /**
     * ADMIN assigns staff to an application.
     * Mirrors: INSERT staff_assignments + UPDATE applications.assigned_staff_id → notify staff
     */
    const assignStaff = useCallback((applicationId, staffUserId, adminUserId) => {
        setDb(prev => {
            const app = prev.applications.find(a => a.application_id === applicationId);
            const staff = prev.users.find(u => u.user_id === staffUserId);
            if (!app || !staff) return prev;

            let s = {
                ...prev,
                applications: prev.applications.map(a =>
                    a.application_id === applicationId
                        ? { ...a, assigned_staff_id: staffUserId, updated_at: now() }
                        : a
                ),
                staffAssignments: [
                    ...prev.staffAssignments,
                    { assignment_id: uid(), application_id: applicationId, staff_user_id: staffUserId, assigned_by_admin_id: adminUserId, assignment_status: 'Assigned', remarks: '', assigned_at: now(), completed_at: null },
                ],
            };
            s = _notify(s, staffUserId, applicationId, 'New Assignment 📋', `You are assigned to: ${app.business_name}`, 'Staff Assigned');
            s = _log(s, adminUserId, applicationId, 'Staff Assigned', `${staff.full_name} assigned to ${app.business_name}`, null, { staff_user_id: staffUserId });
            return s;
        });
    }, []);

    /**
     * ANY portal updates an application status.
     * Mirrors: UPDATE applications.status → INSERT status_history → notify client + staff
     */
    const updateApplicationStatus = useCallback((applicationId, newStatus, changedByUserId) => {
        setDb(prev => {
            const app = prev.applications.find(a => a.application_id === applicationId);
            if (!app) return prev;
            const oldStatus = app.status;

            let s = {
                ...prev,
                applications: prev.applications.map(a =>
                    a.application_id === applicationId
                        ? { ...a, status: newStatus, updated_at: now(), ...(newStatus === 'Completed' ? { completed_at: now() } : {}) }
                        : a
                ),
                statusHistory: [
                    ...prev.statusHistory,
                    { history_id: uid(), application_id: applicationId, changed_by: changedByUserId, old_status: oldStatus, new_status: newStatus, created_at: now() },
                ],
            };
            // Notify client
            s = _notify(s, app.client_user_id, applicationId, 'Status Updated 🔔', `${app.business_name} is now: ${newStatus}`, 'Status Changed');
            // Notify staff if different from changer
            if (app.assigned_staff_id && app.assigned_staff_id !== changedByUserId) {
                s = _notify(s, app.assigned_staff_id, applicationId, 'Application Updated', `${app.business_name} → ${newStatus}`, 'Status Changed');
            }
            s = _log(s, changedByUserId, applicationId, 'Status Updated', `${oldStatus} → ${newStatus}`, { status: oldStatus }, { status: newStatus });
            return s;
        });
    }, []);

    /**
     * CLIENT uploads a document.
     * Mirrors: INSERT documents → notify assigned staff
     */
    const uploadDocument = useCallback((applicationId, uploadedByUserId, docType, fileName) => {
        const docId = 'DOC-' + uid();
        setDb(prev => {
            const app = prev.applications.find(a => a.application_id === applicationId);
            const uploader = prev.users.find(u => u.user_id === uploadedByUserId);
            let s = {
                ...prev,
                documents: [...prev.documents, {
                    document_id: docId, application_id: applicationId,
                    uploaded_by_user_id: uploadedByUserId, document_type: docType,
                    file_name: fileName, file_url: '#', review_status: 'Pending',
                    reviewed_by_user_id: null, review_comments: '',
                    uploaded_at: now(), reviewed_at: null,
                }],
            };
            if (app?.assigned_staff_id) {
                s = _notify(s, app.assigned_staff_id, applicationId, 'Document Uploaded 📄', `${uploader?.full_name} uploaded ${docType} for ${app.business_name}`, 'Document Required');
            }
            // Also notify admin
            const admins = prev.users.filter(u => u.role === 'admin');
            admins.forEach(a => {
                s = _notify(s, a.user_id, applicationId, 'Document Uploaded 📄', `${uploader?.full_name} uploaded ${docType} for ${app?.business_name}`, 'Document Required');
            });
            s = _log(s, uploadedByUserId, applicationId, 'Document Uploaded', `${docType}: ${fileName}`, null, { type: docType });
            return s;
        });
        return docId;
    }, []);

    /**
     * STAFF reviews (approves/rejects) a document.
     * Mirrors: UPDATE documents.review_status → notify client
     */
    const reviewDocument = useCallback((documentId, reviewStatus, reviewedByUserId, comments = '') => {
        setDb(prev => {
            const doc = prev.documents.find(d => d.document_id === documentId);
            const app = doc ? prev.applications.find(a => a.application_id === doc.application_id) : null;
            if (!doc || !app) return prev;

            let s = {
                ...prev,
                documents: prev.documents.map(d =>
                    d.document_id === documentId
                        ? { ...d, review_status: reviewStatus, reviewed_by_user_id: reviewedByUserId, review_comments: comments, reviewed_at: now() }
                        : d
                ),
            };
            const notifType = reviewStatus === 'Approved' ? 'Document Approved' : 'Document Rejected';
            s = _notify(s, app.client_user_id, app.application_id, `Document ${reviewStatus}`, `Your ${doc.document_type} for ${app.business_name} was ${reviewStatus.toLowerCase()}.`, notifType);
            s = _log(s, reviewedByUserId, app.application_id, `Document ${reviewStatus}`, `${doc.document_type} ${reviewStatus.toLowerCase()}`, { status: 'Pending' }, { status: reviewStatus });
            return s;
        });
    }, []);

    /**
     * STAFF updates KYC review.
     * Mirrors: UPDATE kyc_records → notify client → auto-update application status (if Approved → In Progress)
     */
    const updateKYC = useCallback((applicationId, kycStatus, reviewedByStaffId, remarks = '') => {
        setDb(prev => {
            const app = prev.applications.find(a => a.application_id === applicationId);
            if (!app) return prev;

            let s = {
                ...prev,
                kycRecords: prev.kycRecords.map(k =>
                    k.application_id === applicationId
                        ? { ...k, overall_kyc_status: kycStatus, reviewed_by_staff_id: reviewedByStaffId, reviewed_at: now(), remarks, updated_at: now() }
                        : k
                ),
            };

            if (kycStatus === 'Approved') {
                s._notify_kyc_approved = true;
                // Auto-advance application
                s.applications = s.applications.map(a =>
                    a.application_id === applicationId && a.status === 'KYC Review'
                        ? { ...a, status: 'In Progress', updated_at: now() }
                        : a
                );
                s = _notify(s, app.client_user_id, applicationId, 'KYC Approved ✅', `Your KYC for ${app.business_name} has been approved!`, 'KYC Approved');
                // Notify admin
                prev.users.filter(u => u.role === 'admin').forEach(a => {
                    s = _notify(s, a.user_id, applicationId, 'KYC Approved', `KYC approved for ${app.business_name}`, 'KYC Approved');
                });
                s = _log(s, reviewedByStaffId, applicationId, 'KYC Approved', `KYC approved — application advanced to In Progress`, { kyc: prev.kycRecords.find(k => k.application_id === applicationId)?.overall_kyc_status }, { kyc: 'Approved' });
            } else if (kycStatus === 'Rejected') {
                s = _notify(s, app.client_user_id, applicationId, 'KYC Rejected ❌', `Your KYC for ${app.business_name} was rejected. Please resubmit.`, 'KYC Rejected');
                s = _log(s, reviewedByStaffId, applicationId, 'KYC Rejected', `KYC rejected for ${app.business_name}`, { kyc: 'Under Review' }, { kyc: 'Rejected' });
            } else {
                s = _log(s, reviewedByStaffId, applicationId, 'KYC Status Updated', `KYC updated to ${kycStatus}`, null, { kyc: kycStatus });
            }
            return s;
        });
    }, []);

    /**
     * STAFF submits application to ACRA.
     * Mirrors: INSERT acra_submissions → UPDATE applications.status = 'Submitted to ACRA' → notify client
     */
    const submitToACRA = useCallback((applicationId, submittedByUserId, referenceNumber) => {
        setDb(prev => {
            const app = prev.applications.find(a => a.application_id === applicationId);
            if (!app) return prev;
            const ref = referenceNumber || 'ACRA-' + uid();

            let s = {
                ...prev,
                acraSubmissions: [...prev.acraSubmissions, {
                    acra_submission_id: uid(), application_id: applicationId,
                    submitted_by_user_id: submittedByUserId, submission_type: 'Company Incorporation',
                    submission_reference: ref, submission_status: 'Submitted',
                    submission_date: now().slice(0, 10), response_date: null, response_message: '',
                    created_at: now(), updated_at: now(),
                }],
                applications: prev.applications.map(a =>
                    a.application_id === applicationId
                        ? { ...a, status: 'Submitted to ACRA', acra_ref_number: ref, updated_at: now() }
                        : a
                ),
            };
            s = _notify(s, app.client_user_id, applicationId, 'Submitted to ACRA 🚀', `${app.business_name} submitted to ACRA. Reference: ${ref}`, 'Submitted to ACRA');
            prev.users.filter(u => u.role === 'admin').forEach(a => {
                s = _notify(s, a.user_id, applicationId, 'Submitted to ACRA', `${app.business_name} submitted to ACRA by staff.`, 'Submitted to ACRA');
            });
            s = _log(s, submittedByUserId, applicationId, 'ACRA Submitted', `Application submitted to ACRA. Ref: ${ref}`, { status: 'In Progress' }, { status: 'Submitted to ACRA', acra_ref: ref });
            return s;
        });
    }, []);

    /**
     * ADMIN marks ACRA submission as approved (registration complete).
     * Mirrors: UPDATE acra_submissions.status = 'Approved' → UPDATE applications.status = 'Completed' → notify client
     */
    const completeApplication = useCallback((applicationId, adminUserId) => {
        setDb(prev => {
            const app = prev.applications.find(a => a.application_id === applicationId);
            if (!app) return prev;

            let s = {
                ...prev,
                applications: prev.applications.map(a =>
                    a.application_id === applicationId
                        ? { ...a, status: 'Completed', completed_at: now(), updated_at: now() }
                        : a
                ),
                acraSubmissions: prev.acraSubmissions.map(sub =>
                    sub.application_id === applicationId
                        ? { ...sub, submission_status: 'Approved', response_date: now().slice(0, 10), updated_at: now() }
                        : sub
                ),
            };
            s = _notify(s, app.client_user_id, applicationId, '🎉 Company Registered!', `Congratulations! ${app.business_name} is now officially registered with ACRA.`, 'Application Completed');
            if (app.assigned_staff_id) {
                s = _notify(s, app.assigned_staff_id, applicationId, 'Application Completed ✅', `${app.business_name} has been completed.`, 'Application Completed');
            }
            s = _log(s, adminUserId, applicationId, 'Application Completed', `${app.business_name} registration complete`, { status: 'Submitted to ACRA' }, { status: 'Completed' });
            return s;
        });
    }, []);

    /**
     * ADMIN adds a new staff member.
     */
    const addStaffMember = useCallback((staffData) => {
        const newUser = {
            user_id: 'U' + uid(), full_name: staffData.fullName, email: staffData.email,
            phone: staffData.phone || '', role: 'staff', status: 'active',
            avatar_color: '#' + Math.floor(Math.random() * 0xffffff).toString(16).padStart(6, '0'),
            created_at: now(), updated_at: now(),
        };
        setDb(prev => ({ ...prev, users: [...prev.users, newUser] }));
        return newUser;
    }, []);

    /**
     * Mark notification(s) as read.
     */
    const markNotificationsRead = useCallback((userId) => {
        setDb(prev => ({
            ...prev,
            notifications: prev.notifications.map(n =>
                n.user_id === userId ? { ...n, is_read: true } : n
            ),
        }));
    }, []);

    /**
     * Add a follow-up task.
     */
    const addFollowup = useCallback((applicationId, createdByUserId, assignedToUserId, type, notes, dueDate) => {
        const f = {
            followup_id: 'F-' + uid(), application_id: applicationId,
            created_by_user_id: createdByUserId, assigned_to_user_id: assignedToUserId,
            followup_type: type, due_date: dueDate, status: 'Open', notes, resolution_notes: '',
            created_at: now(), updated_at: now(),
        };
        setDb(prev => {
            let s = { ...prev, followups: [...prev.followups, f] };
            if (assignedToUserId) {
                const app = prev.applications.find(a => a.application_id === applicationId);
                s = _notify(s, assignedToUserId, applicationId, 'Follow-up Required ⚠️', notes, 'Follow-up Required');
            }
            return s;
        });
    }, []);

    // ── Selector helpers (computed views) ─────────────────────────────────────

    /** Get all applications visible to a user based on their role */
    const getApplicationsForUser = useCallback((userId, role) => {
        const { applications, users, kycRecords, documents } = db;
        return applications.map(app => {
            const client = users.find(u => u.user_id === app.client_user_id);
            const staff = users.find(u => u.user_id === app.assigned_staff_id);
            const kyc = kycRecords.find(k => k.application_id === app.application_id);
            const docs = documents.filter(d => d.application_id === app.application_id);
            return { ...app, client_name: client?.full_name, client_email: client?.email, staff_name: staff?.full_name, kyc_status: kyc?.overall_kyc_status, total_docs: docs.length, pending_docs: docs.filter(d => d.review_status === 'Pending').length };
        }).filter(app => {
            if (role === 'admin') return true;
            if (role === 'staff') return app.assigned_staff_id === userId;
            if (role === 'client') return app.client_user_id === userId;
            return false;
        });
    }, [db]);

    /** Dashboard stats for admin */
    const getAdminStats = useCallback(() => {
        const { applications, users } = db;
        return {
            total_clients: users.filter(u => u.role === 'client').length,
            total_staff: users.filter(u => u.role === 'staff').length,
            total_apps: applications.length,
            new: applications.filter(a => a.status === 'New').length,
            kyc_review: applications.filter(a => a.status === 'KYC Review').length,
            pending_docs: applications.filter(a => a.status === 'Pending Documents').length,
            in_progress: applications.filter(a => a.status === 'In Progress').length,
            submitted_acra: applications.filter(a => a.status === 'Submitted to ACRA').length,
            completed: applications.filter(a => a.status === 'Completed').length,
            rejected: applications.filter(a => a.status === 'Rejected').length,
            high_priority: applications.filter(a => a.priority === 'High' || a.priority === 'Emergency').length,
            emergency: applications.filter(a => a.priority === 'Emergency').length,
        };
    }, [db]);

    /** Unread notification count for user */
    const getUnreadCount = useCallback((userId) => {
        return db.notifications.filter(n => n.user_id === userId && !n.is_read).length;
    }, [db]);

    /** Dashboard "Today" stats for admin */
    const getAdminTodayStats = useCallback(() => {
        const { applications, kycRecords, acraSubmissions } = db;
        const todayPrefix = now().slice(0, 10);

        return {
            apps_today: applications.filter(a => a.created_at.startsWith(todayPrefix)).length,
            kyc_approved_today: kycRecords.filter(k => k.overall_kyc_status === 'Approved' && k.updated_at.startsWith(todayPrefix)).length,
            docs_requested_today: applications.filter(a => a.status === 'Pending Documents' && a.updated_at.startsWith(todayPrefix)).length,
            acra_today: acraSubmissions.filter(a => a.created_at.startsWith(todayPrefix)).length,
        };
    }, [db]);

    /** Staff workload overview */
    const getStaffWorkload = useCallback(() => {
        const { applications, users } = db;
        const staffList = users.filter(u => u.role === 'staff');
        return staffList.map(staff => {
            const activeCases = applications.filter(a => a.assigned_staff_id === staff.user_id && a.status !== 'Completed' && a.status !== 'Rejected').length;
            return {
                staff_name: staff.full_name,
                active_cases: activeCases,
                avatar_color: staff.avatar_color
            };
        }).sort((a, b) => b.active_cases - a.active_cases);
    }, [db]);

    /** Get company profile with directors and shareholders */
    const getCompanyProfile = useCallback((companyId) => {
        const company = db.companies.find(c => c.company_id === companyId);
        if (!company) return null;
        return {
            ...company,
            directors: db.directors.filter(d => d.company_id === companyId),
            shareholders: db.shareholders.filter(s => s.company_id === companyId),
            complianceEvents: db.complianceEvents.filter(e => e.company_id === companyId),
            documents: db.vaultDocuments.filter(doc => doc.company_id === companyId),
        };
    }, [db]);

    /** Get company by client user id */
    const getCompanyByUserId = useCallback((userId) => {
        return db.companies.find(c => c.client_user_id === userId);
    }, [db]);

    /** Get vault documents for a specific company */
    const getVaultDocuments = useCallback((companyId) => {
        return db.vaultDocuments.filter(d => d.company_id === companyId);
    }, [db]);

    /** Get compliance reminders for a user's company or all (for admin) */
    const getComplianceReminders = useCallback((userId, role) => {
        if (role === 'admin' || role === 'staff') return db.complianceEvents;
        const company = db.companies.find(c => c.client_user_id === userId);
        return company ? db.complianceEvents.filter(e => e.company_id === company.company_id) : [];
    }, [db]);

    // ─────────────────────────────────────────────────────────────────────────

    return (
        <AppContext.Provider value={{
            db,
            // Write operations (sync)
            submitApplication,
            assignStaff,
            updateApplicationStatus,
            uploadDocument,
            reviewDocument,
            updateKYC,
            submitToACRA,
            completeApplication,
            addStaffMember,
            markNotificationsRead,
            addFollowup,
            // Read operations (selectors)
            getApplicationsForUser,
            getAdminStats,
            getAdminTodayStats,
            getStaffWorkload,
            getUnreadCount,
            // Corporate helpers
            getCompanyProfile,
            getCompanyByUserId,
            getVaultDocuments,
            getComplianceReminders,
        }}>
            {children}
        </AppContext.Provider>
    );
}

export function useAppData() {
    const ctx = useContext(AppContext);
    if (!ctx) throw new Error('useAppData must be used inside AppProvider');
    return ctx;
}
