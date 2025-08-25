# Salesforce-Self-Certification
# Self Certification LWC

This package provides two Lightning Web Components for managing self-certifications in Salesforce:

- **SelfCertificationUser** → Allows end users to submit and view their own certifications.
- **SelfCertificationAdmin** → Allows admins to view all certifications, filter by fields, and export results.

---

## 🚀 Installation

1. Deploy the `selfCertificationUser` and `selfCertificationAdmin` folders to your Salesforce org.
2. Ensure the **Apex class `SelfCertificationController`** is available with these methods:
   - `getUserCertifications(page, pageSize)`
   - `saveCertification(certDate, fileName, base64Data)`
   - `getAllCertifications(page, pageSize, country, certifiedBy, status)`
3. Add the components to a **Lightning App Page**, **Record Page**, or **Home Page** using App Builder.

---

## 📌 Features

### User Component
- Submit new certification with **date** + **PDF file upload**
- Paginated table of user’s certifications
- Success/error toasts

### Admin Component
- View all certifications
- Filter by **Country, Certified By, Status**
- Pagination
- Export to CSV

---

## ⚡ Future Improvements
- Configurable **page size dropdown**
- Inline editing for admin
- Auto-refresh after submission
