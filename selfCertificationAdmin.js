import { LightningElement, track, wire } from 'lwc';
import getAllCertifications from '@salesforce/apex/SelfCertificationController.getAllCertifications';

export default class SelfCertificationAdmin extends LightningElement {
    @track certifications = [];
    @track page = 1;
    @track totalPages = 1;
    pageSize = 5;

    filterCountry = '';
    filterCertifiedBy = '';
    filterStatus = '';

    statusOptions = [
        { label: 'All', value: '' },
        { label: 'Valid', value: 'Valid' },
        { label: 'Expired', value: 'Expired' }
    ];

    columns = [
        { label: 'Country', fieldName: 'Country__c' },
        { label: 'Certification Date', fieldName: 'Certification_Date__c', type: 'date' },
        { label: 'Next Due Date', fieldName: 'Next_Due_Date__c', type: 'date' },
        { label: 'Certified By', fieldName: 'Certified_By_Name__c' },
        { label: 'Status', fieldName: 'Status__c' },
        { label: 'Email', fieldName: 'Email__c' }
    ];

    @wire(getAllCertifications, {
        page: '$page',
        pageSize: '$pageSize',
        country: '$filterCountry',
        certifiedBy: '$filterCertifiedBy',
        status: '$filterStatus'
    })
    wiredCerts({ error, data }) {
        if (data) {
            this.certifications = data.records;
            this.totalPages = Math.ceil(data.total / this.pageSize);
        } else if (error) {
            console.error('Error loading certifications', error);
        }
    }

    handleFilterChange(event) {
        const field = event.target.label;
        if (field === 'Country') this.filterCountry = event.target.value;
        else if (field === 'Certified By') this.filterCertifiedBy = event.target.value;
        else if (field === 'Status') this.filterStatus = event.detail.value;

        this.page = 1;
    }

    handlePrev() {
        if (this.page > 1) this.page--;
    }
    handleNext() {
        if (this.page < this.totalPages) this.page++;
    }

    exportCSV() {
        let csv = 'Country,Certification Date,Next Due Date,Certified By,Status,Email\n';
        this.certifications.forEach(rec => {
            csv += `"${rec.Country__c || ''}","${rec.Certification_Date__c || ''}","${rec.Next_Due_Date__c || ''}","${rec.Certified_By_Name__c || ''}","${rec.Status__c || ''}","${rec.Email__c || ''}"\n`;
        });

        let blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        let link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'SelfCertifications.csv';
        link.click();
    }
}
