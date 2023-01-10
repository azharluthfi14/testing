const bankList = () => {
    const bank = [
        {
            "label": "BANK BRI",
            "value": "002"
        },
        {
            "label": "BANK EKSPOR INDONESIA",
            "value": "003"
        },
        {
            "label": "BANK MANDIRI",
            "value": "008"
        },
        {
            "label": "BANK BNI",
            "value": "009"
        },
        {
            "label": "BANK BNI SYARIAH",
            "value": "427"
        },
        {
            "label": "BANK DANAMON",
            "value": "011"
        },
        {
            "label": "PERMATA BANK",
            "value": "013"
        },
        {
            "label": "BANK BCA",
            "value": "014"
        },
        {
            "label": "BANK BII",
            "value": "016"
        },
        {
            "label": "BANK PANIN",
            "value": "019"
        },
        {
            "label": "BANK ARTA NIAGA KENCANA",
            "value": "020"
        },
        {
            "label": "BANK NIAGA",
            "value": "022"
        },
        {
            "label": "BANK BUANA IND",
            "value": "023"
        },
        {
            "label": "BANK LIPPO",
            "value": "026"
        },
        {
            "label": "BANK NISP",
            "value": "028"
        },
        {
            "label": "AMERICAN EXPRESS BANK LTD",
            "value": "030"
        },
        {
            "label": "CITIBANK N.A.",
            "value": "031"
        },
        {
            "label": "JP. MORGAN CHASE BANK, N.A.",
            "value": "032"
        },
        {
            "label": "BANK OF AMERICA, N.A",
            "value": "033"
        },
        {
            "label": "ING INDONESIA BANK",
            "value": "034"
        },
        {
            "label": "BANK MULTICOR TBK.",
            "value": "036"
        },
        {
            "label": "BANK ARTHA GRAHA",
            "value": "037"
        },
        {
            "label": "BANK CREDIT AGRICOLE INDOSUEZ",
            "value": "039"
        },
        {
            "label": "THE BANGKOK BANK COMP. LTD",
            "value": "040"
        },
        {
            "label": "THE HONGKONG & SHANGHAI B.C.",
            "value": "041"
        },
        {
            "label": "THE BANK OF TOKYO MITSUBISHI UFJ LTD",
            "value": "042"
        },
        {
            "label": "BANK SUMITOMO MITSUI INDONESIA",
            "value": "045"
        },
        {
            "label": "BANK DBS INDONESIA",
            "value": "046"
        },
        {
            "label": "BANK RESONA PERDANIA",
            "value": "047"
        },
        {
            "label": "BANK MIZUHO INDONESIA",
            "value": "048"
        },
        {
            "label": "STANDARD CHARTERED BANK",
            "value": "050"
        },
        {
            "label": "BANK ABN AMRO",
            "value": "052"
        },
        {
            "label": "BANK KEPPEL TATLEE BUANA",
            "value": "053"
        },
        {
            "label": "BANK CAPITAL INDONESIA, TBK.",
            "value": "054"
        },
        {
            "label": "BANK BNP PARIBAS INDONESIA",
            "value": "057"
        },
        {
            "label": "BANK UOB INDONESIA",
            "value": "058"
        },
        {
            "label": "KOREA EXCHANGE BANK DANAMON",
            "value": "059"
        },
        {
            "label": "RABOBANK INTERNASIONAL INDONESIA",
            "value": "060"
        },
        {
            "label": "ANZ PANIN BANK",
            "value": "061"
        },
        {
            "label": "DEUTSCHE BANK AG.",
            "value": "067"
        },
        {
            "label": "BANK WOORI INDONESIA",
            "value": "068"
        },
        {
            "label": "BANK OF CHINA LIMITED",
            "value": "069"
        },
        {
            "label": "BANK BUMI ARTA",
            "value": "076"
        },
        {
            "label": "BANK EKONOMI",
            "value": "087"
        },
        {
            "label": "BANK ANTARDAERAH",
            "value": "088"
        },
        {
            "label": "BANK HAGA",
            "value": "089"
        },
        {
            "label": "BANK IFI",
            "value": "093"
        },
        {
            "label": "BANK CENTURY, TBK.",
            "value": "095"
        },
        {
            "label": "BANK MAYAPADA",
            "value": "097"
        },
        {
            "label": "BANK JABAR",
            "value": "110"
        },
        {
            "label": "BANK DKI",
            "value": "111"
        },
        {
            "label": "BPD DIY",
            "value": "112"
        },
        {
            "label": "BANK JATENG",
            "value": "113"
        },
        {
            "label": "BANK JATIM",
            "value": "114"
        },
        {
            "label": "BPD JAMBI",
            "value": "115"
        },
        {
            "label": "BPD ACEH",
            "value": "116"
        },
        {
            "label": "BANK SUMUT",
            "value": "117"
        },
        {
            "label": "BANK NAGARI",
            "value": "118"
        },
        {
            "label": "BANK RIAU",
            "value": "119"
        },
        {
            "label": "BANK SUMSEL",
            "value": "120"
        },
        {
            "label": "BANK LAMPUNG",
            "value": "121"
        },
        {
            "label": "BPD KALSEL",
            "value": "122"
        },
        {
            "label": "BPD KALIMANTAN BARAT",
            "value": "123"
        },
        {
            "label": "BPD KALTIM",
            "value": "124"
        },
        {
            "label": "BPD KALTENG",
            "value": "125"
        },
        {
            "label": "BPD SULSEL",
            "value": "126"
        },
        {
            "label": "BANK SULUT",
            "value": "127"
        },
        {
            "label": "BPD NTB",
            "value": "128"
        },
        {
            "label": "BPD BALI",
            "value": "129"
        },
        {
            "label": "BANK NTT",
            "value": "130"
        },
        {
            "label": "BANK MALUKU",
            "value": "131"
        },
        {
            "label": "BPD PAPUA",
            "value": "132"
        },
        {
            "label": "BANK BENGKULU",
            "value": "133"
        },
        {
            "label": "BPD SULAWESI TENGAH",
            "value": "134"
        },
        {
            "label": "BANK SULTRA",
            "value": "135"
        },
        {
            "label": "BANK NUSANTARA PARAHYANGAN",
            "value": "145"
        },
        {
            "label": "BANK SWADESI",
            "value": "146"
        },
        {
            "label": "BANK MUAMALAT",
            "value": "147"
        },
        {
            "label": "BANK MESTIKA",
            "value": "151"
        },
        {
            "label": "BANK METRO EXPRESS",
            "value": "152"
        },
        {
            "label": "BANK SHINTA INDONESIA",
            "value": "153"
        },
        {
            "label": "BANK MASPION",
            "value": "157"
        },
        {
            "label": "BANK HAGAKITA",
            "value": "159"
        },
        {
            "label": "BANK GANESHA",
            "value": "161"
        },
        {
            "label": "BANK WINDU KENTJANA",
            "value": "162"
        },
        {
            "label": "HALIM INDONESIA BANK",
            "value": "164"
        },
        {
            "label": "BANK HARMONI INTERNATIONAL",
            "value": "166"
        },
        {
            "label": "BANK KESAWAN",
            "value": "167"
        },
        {
            "label": "BANK TABUNGAN NEGARA (PERSERO)",
            "value": "200"
        },
        {
            "label": "BANK HIMPUNAN SAUDARA 1906, TBK .",
            "value": "212"
        },
        {
            "label": "BANK TABUNGAN PENSIUNAN NASIONAL",
            "value": "213"
        },
        {
            "label": "BANK SWAGUNA",
            "value": "405"
        },
        {
            "label": "BANK JASA ARTA",
            "value": "422"
        },
        {
            "label": "BANK MEGA",
            "value": "426"
        },
        {
            "label": "BANK JASA JAKARTA",
            "value": "427"
        },
        {
            "label": "BANK BUKOPIN",
            "value": "441"
        },
        {
            "label": "BANK SYARIAH MANDIRI",
            "value": "451"
        },
        {
            "label": "BANK BISNIS INTERNASIONAL",
            "value": "459"
        },
        {
            "label": "BANK SRI PARTHA",
            "value": "466"
        },
        {
            "label": "BANK JASA JAKARTA",
            "value": "472"
        },
        {
            "label": "BANK BINTANG MANUNGGAL",
            "value": "484"
        },
        {
            "label": "BANK BUMIPUTERA",
            "value": "485"
        },
        {
            "label": "BANK YUDHA BHAKTI",
            "value": "490"
        },
        {
            "label": "BANK MITRANIAGA",
            "value": "491"
        },
        {
            "label": "BANK AGRO NIAGA",
            "value": "494"
        },
        {
            "label": "BANK INDOMONEX",
            "value": "498"
        },
        {
            "label": "BANK ROYAL INDONESIA",
            "value": "501"
        },
        {
            "label": "BANK ALFINDO",
            "value": "503"
        },
        {
            "label": "BANK SYARIAH MEGA",
            "value": "506"
        },
        {
            "label": "BANK INA PERDANA",
            "value": "513"
        },
        {
            "label": "BANK HARFA",
            "value": "517"
        },
        {
            "label": "PRIMA MASTER BANK",
            "value": "520"
        },
        {
            "label": "BANK PERSYARIKATAN INDONESIA",
            "value": "521"
        },
        {
            "label": "BANK AKITA",
            "value": "525"
        },
        {
            "label": "LIMAN INTERNATIONAL BANK",
            "value": "526"
        },
        {
            "label": "ANGLOMAS INTERNASIONAL BANK",
            "value": "531"
        },
        {
            "label": "BANK DIPO INTERNATIONAL",
            "value": "523"
        },
        {
            "label": "BANK KESEJAHTERAAN EKONOMI",
            "value": "535"
        },
        {
            "label": "BANK UIB",
            "value": "536"
        },
        {
            "label": "BANK ARTOS IND",
            "value": "542"
        },
        {
            "label": "BANK PURBA DANARTA",
            "value": "547"
        },
        {
            "label": "BANK MULTI ARTA SENTOSA",
            "value": "548"
        },
        {
            "label": "BANK MAYORA",
            "value": "553"
        },
        {
            "label": "BANK INDEX SELINDO",
            "value": "555"
        },
        {
            "label": "BANK VICTORIA INTERNATIONAL",
            "value": "566"
        },
        {
            "label": "BANK EKSEKUTIF",
            "value": "558"
        },
        {
            "label": "CENTRATAMA NASIONAL BANK",
            "value": "559"
        },
        {
            "label": "BANK FAMA INTERNASIONAL",
            "value": "562"
        },
        {
            "label": "BANK SINAR HARAPAN BALI",
            "value": "564"
        },
        {
            "label": "BANK HARDA",
            "value": "567"
        },
        {
            "label": "BANK FINCONESIA",
            "value": "945"
        },
        {
            "label": "BANK MERINCORP",
            "value": "946"
        },
        {
            "label": "BANK MAYBANK INDOCORP",
            "value": "947"
        },
        {
            "label": "BANK OCBC – INDONESIA",
            "value": "948"
        },
        {
            "label": "BANK CHINA TRUST INDONESIA",
            "value": "949"
        },
        {
            "label": "BANK COMMONWEALTH",
            "value": "950"
        },
        {
            "label": "BANK BJB SYARIAH",
            "value": "425"
        },
        {
            "label": "BPR KS (KARYAJATNIKA SEDAYA)",
            "value": "688"
        },
        {
            "label": "INDOSAT DOMPETKU",
            "value": "789"
        },
        {
            "label": "TELKOMSEL TCASH",
            "value": "911"
        },
        {
            "label": "LINKAJA",
            "value": "911"
        }
    ]
    return bank;
};

export {
    bankList,
};
