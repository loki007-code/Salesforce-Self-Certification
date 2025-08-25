import { LightningElement, track, wire } from 'lwc';
import getUserCertifications from '@salesforce/apex/SelfCertificationController.getUserCertifications';
import saveCertification from '@salesforce/apex/SelfCertificationController.saveCertification';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class SelfCertificationUser extends LightningElement {
    @track certifications = [];
    @track isModalOpen = false;
    @track certDate;
    @track fileData;
    @track page = 1;
    @track totalPages = 1;
    pageSize = 5;

    columns = [
        { label: 'Country', fieldName: 'Country__c' },
        { label: 'Certification Date', fieldName: 'Certification_Date__c', type: 'date' },
        { label: 'Next Due Date', fieldName: 'Next_Due_Date__c', type: 'date' },
        { label: 'Status', fieldName: 'Status__c' }
    ];

    @wire(getUserCertifications, { page: '$page', pageSize: '$pageSize' })
    wiredCerts({ error, data }) {
        if (data) {
            this.certifications = data.records;
            this.totalPages = Math.ceil(data.total / this.pageSize);
        } else if (error) {
            console.error('Error loading certifications', error);
        }
    }

    handleOpen() {
        this.isModalOpen = true;
    }
    handleClose() {
        this.isModalOpen = false;
        this.certDate = null;
        this.fileData = null;
    }
    handleDateChange(event) {
        this.certDate = event.target.value;
    }
    handleFileChange(event) {
        const file = event.target.files[0];
        if (file && file.type === 'application/pdf') {
            const reader = new FileReader();
            reader.onload = () => {
                const base64 = reader.result.split(',')[1];
                this.fileData = { filename: file.name, base64 };
            };
            reader.readAsDataURL(file);
        } else {
            this.showToast('Error', 'Only PDF files are allowed', 'error');
        }
    }
    handleSubmit() {
        if (!this.certDate || !this.fileData) {
            this.showToast('Error', 'Please fill all fields', 'error');
            return;
        }
        saveCertification({ certDate: this.certDate, fileName: this.fileData.filename, base64Data: this.fileData.base64 })
            .then(() => {
                this.showToast('Success', 'Certification submitted successfully', 'success');
                this.handleClose();
                return refreshApex(this.wiredCerts);
            })
            .catch(err => {
                console.error('Error:', err.body?.message || err.message);
                this.showToast('Error', 'Submission failed', 'error');
            });
    }

    handlePrev() {
        if (this.page > 1) this.page--;
    }
    handleNext() {
        if (this.page < this.totalPages) this.page++;
    }

    showToast(title, message, variant) {
        this.dispatchEvent(new ShowToastEvent({ title, message, variant }));
    }
}
