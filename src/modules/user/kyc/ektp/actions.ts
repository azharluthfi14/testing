import { CommonError } from '../../../types';
import {
    EKTP_CREATE,
    EKTP_CREATE_FETCH,
    EKTP_DATA,
    EKTP_ERROR,
    EKTP_FETCH,
} from './constants';

export interface EktpDts {
    nik: string;
    nama: string;
    agama: string;
    rt_rw: string;
    alamat: string;
    provinsi: string;
    kecamatan: string;
    pekerjaan: string;
    tempat_lahir: string;
    jenis_kelamin: string;
    tanggal_lahir: string;
    berlaku_hingga: string;
    golongan_darah: string;
    kabupaten_kota: string;
    kelurahan_desa: string;
    kewarganegaraan: string;
    status_perkawinan: string;
}

export interface EktpREs {
    status: string;
    analytic_type: string;
    result: EktpDts;
}

export interface EktpJob {
    id: string;
    result: EktpREs;
}

export interface Ektp {
    job: EktpJob;
    message: string;
    ok: boolean;
}

export interface EktpFetch {
    type: typeof EKTP_FETCH;
}

export interface EktpData {
    type: typeof EKTP_DATA;
    payload: Ektp;
}

export interface EktpCreateFetch {
    type: typeof EKTP_CREATE_FETCH;
    payload: FormData;
}

export interface EktpCreateData {
    type: typeof EKTP_CREATE;
    payload: Ektp;
}


export interface EktpError {
    type: typeof EKTP_ERROR;
    error: CommonError;
}

export type EktpAction = EktpFetch
    | EktpData
    | EktpCreateFetch
    | EktpCreateData
    | EktpError;

export const ektpFetch = (): EktpFetch => ({
    type: EKTP_FETCH
});


export const ektpData = (payload: EktpData['payload']): EktpData => ({
    type: EKTP_DATA,
    payload,
});

export const ektpCreateFetch = (payload: EktpCreateFetch['payload']): EktpCreateFetch => ({
    type: EKTP_CREATE_FETCH,
    payload,
});

export const ektpCreate = (payload: EktpCreateData['payload']): EktpCreateData => ({
    type: EKTP_CREATE,
    payload,
});

export const ektpError = (error: CommonError): EktpError => ({
    type: EKTP_ERROR,
    error,
});
