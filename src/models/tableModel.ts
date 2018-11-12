import { typeDynamo } from "../lib/createDb";

class TableModel {
    id: string;
    entity: string;
    email: string;
    fName: string;
    lName: string;
    phone: string;
    dob: Date;
    summary: string;
    skills: Skill[];
    educationItems: EducationItem[];
    activeJobs: string[];
    jobHistory: string[];
    avatarUrl: string;
    backgroundUrl: string;
    socialLinks: SocialLink[];
    tagline: string;
    contacts: String[];
    title: string;
    employer: string;
    description: string;
    datePosted: Date;
    dateAccepted: Date;
    isAccepted: boolean;
    payment: number;
    progress: number;
    cognitoId: string;
    refresh_token: string;
}

interface Skill {
    title: string;
    description: string;
}

interface EducationItem {
    degreeTitle: string;
    startYear: string;
    endYear: string;
    collegeName: string;
    grade: string;
    description: string;
}

interface SocialLink {
    name: string;
    linkUrl: string;
}

const AppTable = typeDynamo.define(TableModel, {
    tableName: 'app-table-dev',
    partitionKey: 'id',
}).withGlobalIndex({
    indexName: 'entityIndex',
    partitionKey: 'id',
    projectionType: 'ALL'
}).getInstance();

export const findAllEntries = async () => await AppTable.find().allResults().execute();

export const findEntriesByType = async (entity: string) => await AppTable.onIndex.entityIndex.find({entity}).allResults().execute();

export const findEntryById = async (id: string, entity: string) => await AppTable.find({ id, entity }).execute();

export const findEntriesByBatchIds = async (idBatch: string[], entity: string) => await AppTable.find(idBatch.map(id => ({id, entity}))).execute();

export const postNewEntry = async (newEntry: object) => await AppTable.save(newEntry).execute();

export const updateEntry = async (id: string, entity: string, changes: object) => await AppTable.update({ id, entity}, changes ).execute();

export const deleteEntry = async (id: string, entity: string) => await AppTable.delete({ id, entity }).execute();