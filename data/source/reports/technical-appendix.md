# Technical Appendix

**AI Exposure and Employment Change in the Richmond Metropolitan Area**

Companion to the main report. Every table here is computed from the public
source data rather than transcribed, so no figure in it can drift from the
releases cited in Section A.

---

## A. Source files

All paths are relative to `data/`.

| File | Contents | Origin |
|:----------------------------------|:--------------------------------|:--------------|
| `job_exposure.csv` | 756 occupations with observed-exposure scores | Anthropic |
| `oesm25ma/MSA_M2025_dl.xlsx` | May 2025 metro employment, wages, location quotients | BLS OEWS |
| `oesm25nat/national_M2025_dl.xlsx` | May 2025 national employment and wages | BLS OEWS |
| `oesm24ma/MSA_M2024_dl.xlsx` | May 2024 metro employment and location quotients | BLS OEWS |
| `oesm23nat/national_M2023_dl.xlsx` | May 2023 national employment | BLS OEWS |
| `richmond_exposure_base.csv` | May 2023 Richmond employment and location quotients | BLS OEWS |
| `Richmond-VA-Largest-Employers.pdf` | Employer headcounts, February 2026 | Greater Richmond Partnership |

The OEWS bulk archives are downloaded manually from
`bls.gov/oes/special-requests/`, which returns HTTP 403 to scripted requests.
They are excluded from version control; the small national extracts are retained.

The exposure file is `labor_market_impacts/job_exposure.csv` from the Anthropic
Economic Index repository on Hugging Face (`Anthropic/EconomicIndex`), created
5 March 2026 and retrieved July 2026, released under CC BY 4.0. It was unchanged
at retrieval, so this is the current vintage of the measure.

## B. Method

### B.1 Join and coverage

| Step | Occupations | Employment |
|---|---:|---:|
| Richmond detailed occupations, May 2025 | 598 | — |
| Without an exposure score or national comparator | 75 | 56,020 |
| Matched to an exposure score | 523 | 584,030 |
| Metropolitan total, all occupations | — | 660,350 |
| Coverage | — | 88.4% |

Unmatched employment sits in occupations absent from the exposure dataset, which
covers 756 of roughly 830 detailed SOC codes.

### B.2 Definitions

**Observed exposure** — the share of an occupation's tasks appearing in measured
model interactions, from 0 to 1. A national constant, applied identically to
Richmond and national employment.

**Exposure-weighted jobs** — employment multiplied by observed exposure. Not a
count of jobs at risk; a measure of how much of an occupation's task content is
represented in observed usage, scaled by how many people hold it.

**Location quotient** — the ratio of an occupation's local employment share to its
national share. Above 1.0 means the region employs it more intensively than the
nation does.

**Mean exposure** — employment-weighted, i.e. total exposure-weighted jobs divided
by total employment.

### B.3 National comparison

Both means are computed over the same 523 occupations, each measured in both
Richmond and the nation in May 2025. Since exposure scores are identical across
areas, the difference between the two means is entirely a difference in employment
composition. Each occupation's contribution to the gap is its exposure score times
the difference between its Richmond and national employment shares; these
contributions sum exactly to the gap.

## C. Exposure by major occupational group

| Group | Occs | Employment | Exposed jobs | Mean exposure | Share of exposure | Mean wage |
|--------------------------------|------:|----------:|------------:|-------------:|-----------------:|---------:|
| Office & Administrative Support | 43 | 71,030 | 23,603 | 0.332 | 29.7 | 50,539 |
| Sales | 13 | 52,780 | 14,167 | 0.268 | 17.8 | 51,808 |
| Business & Financial | 25 | 49,740 | 13,893 | 0.279 | 17.5 | 91,242 |
| Computer & Mathematical | 18 | 23,940 | 8,397 | 0.351 | 10.6 | 117,369 |
| Management | 31 | 39,280 | 5,535 | 0.141 | 7.0 | 149,784 |
| Education & Library | 46 | 28,360 | 5,181 | 0.183 | 6.5 | 69,436 |
| Healthcare Practitioners | 45 | 39,130 | 2,129 | 0.054 | 2.7 | 101,146 |
| Arts, Design & Media | 23 | 7,460 | 1,553 | 0.208 | 2.0 | 58,434 |
| Legal | 7 | 6,430 | 1,355 | 0.211 | 1.7 | 132,835 |
| Life, Physical & Social Science | 29 | 5,300 | 534 | 0.101 | 0.7 | 81,697 |
| Installation & Repair | 36 | 26,080 | 457 | 0.018 | 0.6 | 61,659 |
| Protective Service | 13 | 14,910 | 454 | 0.030 | 0.6 | 61,129 |
| Food Preparation & Serving | 14 | 52,240 | 454 | 0.009 | 0.6 | 37,501 |
| Construction & Extraction | 27 | 28,030 | 365 | 0.013 | 0.5 | 57,898 |
| Personal Care & Service | 16 | 14,610 | 314 | 0.021 | 0.4 | 33,799 |
| Architecture & Engineering | 27 | 8,450 | 299 | 0.035 | 0.4 | 100,729 |
| Community & Social Service | 9 | 7,280 | 289 | 0.040 | 0.4 | 60,528 |
| Healthcare Support | 13 | 15,370 | 169 | 0.011 | 0.2 | 45,169 |
| Building & Grounds | 7 | 18,790 | 112 | 0.006 | 0.1 | 37,802 |
| Production | 55 | 19,330 | 94 | 0.005 | 0.1 | 52,436 |
| Transportation & Material Moving | 21 | 54,980 | 42 | 0.001 | 0.1 | 46,250 |
| Farming, Fishing & Forestry | 5 | 510 | 5 | 0.009 | 0.0 | 46,125 |

## D. All occupations with exposure at or above 0.25

71 occupations, 143,640 jobs, 73.7% of metropolitan exposure.

| SOC | Occupation | Employment | Exposure | Exposed jobs | LQ | Mean wage |
|-------|----------------------------------|----------:|--------:|------------:|------:|---------:|
| 43-4051 | Customer Service Representatives | 10,960 | 0.701 | 7,684 | 0.99 | 44,520 |
| 41-2031 | Retail Salespersons | 16,210 | 0.322 | 5,223 | 0.98 | 35,460 |
| 43-9061 | Office Clerks, General | 10,890 | 0.450 | 4,905 | 1.04 | 47,700 |
| 41-4012 | Sales Representatives, Wholesale and Manufacturing, Except Technical and Scientific Products | 5,080 | 0.628 | 3,190 | 0.97 | 83,320 |
| 13-1161 | Market Research Analysts and Marketing Specialists | 4,550 | 0.648 | 2,950 | 1.19 | 96,240 |
| 13-2011 | Accountants and Auditors | 7,920 | 0.348 | 2,755 | 1.29 | 93,210 |
| 43-6014 | Secretaries and Administrative Assistants, Except Legal, Medical, and Executive | 4,940 | 0.453 | 2,237 | 0.68 | 48,460 |
| 15-1252 | Software Developers | 7,680 | 0.288 | 2,212 | 1.07 | 139,340 |
| 13-1071 | Human Resources Specialists | 4,540 | 0.403 | 1,831 | 1.17 | 83,110 |
| 43-4171 | Receptionists and Information Clerks | 3,550 | 0.434 | 1,540 | 0.92 | 36,750 |
| 43-3031 | Bookkeeping, Accounting, and Auditing Clerks | 4,890 | 0.310 | 1,518 | 0.84 | 53,580 |
| 43-6013 | Medical Secretaries and Administrative Assistants | 4,140 | 0.362 | 1,500 | 1.01 | 44,230 |
| 11-3031 | Financial Managers | 3,480 | 0.391 | 1,360 | 0.97 | 192,080 |
| 41-3031 | Securities, Commodities, and Financial Services Sales Agents | 2,990 | 0.441 | 1,319 | 1.44 | 107,070 |
| 41-1011 | First-Line Supervisors of Retail Sales Workers | 5,000 | 0.263 | 1,314 | 1.05 | 54,000 |
| 25-2031 | Secondary School Teachers, Except Special and Career/Technical Education | 4,420 | 0.290 | 1,282 | 0.98 | 66,610 |
| 15-1232 | Computer User Support Specialists | 2,350 | 0.469 | 1,101 | 0.77 | 64,990 |
| 13-2051 | Financial and Investment Analysts | 1,630 | 0.572 | 932 | 1.06 | 113,900 |
| 15-1211 | Computer Systems Analysts | 2,990 | 0.276 | 826 | 1.35 | 113,840 |
| 15-1212 | Information Security Analysts | 1,690 | 0.486 | 821 | 2.09 | 126,940 |
| 25-2022 | Middle School Teachers, Except Special and Career/Technical Education | 2,760 | 0.297 | 820 | 1.05 | 65,160 |
| 27-3031 | Public Relations Specialists | 1,760 | 0.453 | 797 | 1.46 | 82,880 |
| 13-1151 | Training and Development Specialists | 2,530 | 0.279 | 707 | 1.30 | 79,200 |
| 41-3021 | Insurance Sales Agents | 2,040 | 0.319 | 650 | 1.00 | 77,940 |
| 23-2011 | Paralegals and Legal Assistants | 1,930 | 0.293 | 565 | 1.15 | 67,940 |
| 15-1244 | Network and Computer Systems Administrators | 1,660 | 0.337 | 560 | 1.24 | 103,730 |
| 29-2072 | Medical Records Specialists | 740 | 0.667 | 494 | 0.89 | 56,530 |
| 15-2051 | Data Scientists | 1,050 | 0.461 | 484 | 0.94 | 133,460 |
| 13-2052 | Personal Financial Advisors | 1,350 | 0.350 | 473 | 1.19 | 158,910 |
| 15-2031 | Operations Research Analysts | 1,020 | 0.429 | 437 | 2.22 | 105,800 |
| 25-1071 | Health Specialties Teachers, Postsecondary | 1,430 | 0.304 | 435 | 1.53 | 130,720 |
| 15-1299 | Computer Occupations, All Other | 1,280 | 0.311 | 398 | 0.69 | 111,930 |
| 15-1253 | Software Quality Assurance Analysts and Testers | 720 | 0.519 | 374 | 0.90 | 111,510 |
| 11-2021 | Marketing Managers | 1,090 | 0.320 | 348 | 0.65 | 187,800 |
| 43-9021 | Data Entry Keyers | 480 | 0.671 | 322 | 0.89 | 41,270 |
| 25-9031 | Instructional Coordinators | 1,050 | 0.304 | 320 | 1.09 | 81,210 |
| 43-3011 | Bill and Account Collectors | 1,040 | 0.299 | 311 | 1.54 | 46,640 |
| 27-1024 | Graphic Designers | 760 | 0.367 | 279 | 0.90 | 70,860 |
| 25-3041 | Tutors | 680 | 0.408 | 277 | 0.91 | 50,580 |
| 41-4011 | Sales Representatives, Wholesale and Manufacturing, Technical and Scientific Products | 1,010 | 0.271 | 273 | 0.84 | 126,060 |
| 15-1243 | Database Architects | 440 | 0.579 | 255 | 1.53 | 138,240 |
| 15-1251 | Computer Programmers | 310 | 0.745 | 231 | 0.79 | 111,950 |
| 15-1242 | Database Administrators | 600 | 0.332 | 199 | 2.00 | 102,460 |
| 43-4161 | Human Resources Assistants, Except Payroll and Timekeeping | 470 | 0.405 | 190 | 1.23 | 53,300 |
| 15-1231 | Computer Network Support Specialists | 610 | 0.287 | 175 | 0.98 | 71,400 |
| 25-1011 | Business Teachers, Postsecondary | 400 | 0.307 | 123 | 1.16 | 115,140 |
| 19-4031 | Chemical Technicians | 360 | 0.315 | 113 | 1.47 | 55,060 |
| 13-2054 | Financial Risk Specialists | 380 | 0.265 | 101 | 1.40 | 119,620 |
| 25-1022 | Mathematical Science Teachers, Postsecondary | 230 | 0.430 | 99 | 1.11 | 89,340 |
| 25-1081 | Education Teachers, Postsecondary | 370 | 0.262 | 97 | 1.42 | 76,720 |
| 43-4111 | Interviewers, Except Eligibility and Loan | 230 | 0.385 | 89 | 0.37 | 49,870 |
| 25-1042 | Biological Science Teachers, Postsecondary | 300 | 0.291 | 87 | 1.39 | 92,030 |
| 27-3042 | Technical Writers | 180 | 0.475 | 85 | 0.91 | 84,420 |
| 19-2031 | Chemists | 320 | 0.261 | 84 | 0.90 | 96,510 |
| 11-3131 | Training and Development Managers | 210 | 0.378 | 79 | 1.05 | 136,600 |
| 25-1123 | English Language and Literature Teachers, Postsecondary | 210 | 0.362 | 76 | 0.86 | 80,690 |
| 23-1023 | Judges, Magistrate Judges, and Magistrates | 220 | 0.311 | 68 | 2.11 | 125,220 |
| 23-1021 | Administrative Law Judges, Adjudicators, and Hearing Officers | 210 | 0.305 | 64 | 2.96 | 101,970 |
| 27-3091 | Interpreters and Translators | 140 | 0.430 | 60 | 0.61 | 72,950 |
| 43-2011 | Switchboard Operators, Including Answering Service | 150 | 0.386 | 58 | 1.00 | 36,770 |
| 15-1221 | Computer and Information Research Scientists | 160 | 0.340 | 54 | 1.00 | 160,770 |
| 19-4061 | Social Science Research Assistants | 120 | 0.439 | 53 | 0.95 | 58,490 |
| 25-1066 | Psychology Teachers, Postsecondary | 150 | 0.322 | 48 | 0.85 | 87,440 |
| 25-1032 | Engineering Teachers, Postsecondary | 130 | 0.359 | 47 | 0.75 | 122,550 |
| 41-3041 | Travel Agents | 100 | 0.405 | 41 | 0.45 | 49,180 |
| 29-9021 | Health Information Technologists and Medical Registrars | 110 | 0.306 | 34 | 0.70 | 65,060 |
| 25-4012 | Curators | 80 | 0.412 | 33 | 1.47 | 74,460 |
| 19-3022 | Survey Researchers | 50 | 0.432 | 22 | 1.33 | 87,250 |
| 27-1013 | Fine Artists, Including Painters, Sculptors, and Illustrators | 50 | 0.356 | 18 | 0.97 | 63,370 |
| 19-2012 | Physicists | 40 | 0.273 | 11 | 0.45 | 202,250 |
| 27-1014 | Special Effects Artists and Animators | 30 | 0.357 | 11 | 0.36 | 82,000 |

## E. Over-concentrated exposed occupations

Exposure at or above 0.25 and location quotient at or above 1.10, May 2025.

27 occupations, 41,510 jobs, employment-weighted mean wage $97,096, combined wage bill $4,030,435,400.

| SOC | Occupation | 2023 | 2025 | Change % | LQ | Exposure | Mean wage |
|-------|----------------------------------|------:|------:|--------:|------:|--------:|---------:|
| 13-2011 | Accountants and Auditors | 7,540 | 7,920 | +5.0 | 1.29 | 0.348 | 93,210 |
| 13-1161 | Market Research Analysts and Marketing Specialists | 3,720 | 4,550 | +22.3 | 1.19 | 0.648 | 96,240 |
| 13-1071 | Human Resources Specialists | 4,880 | 4,540 | -7.0 | 1.17 | 0.403 | 83,110 |
| 15-1211 | Computer Systems Analysts | 3,160 | 2,990 | -5.4 | 1.35 | 0.276 | 113,840 |
| 41-3031 | Securities, Commodities, and Financial Services Sales Agents | 3,010 | 2,990 | -0.7 | 1.44 | 0.441 | 107,070 |
| 15-1212 | Information Security Analysts | 1,650 | 1,690 | +2.4 | 2.09 | 0.486 | 126,940 |
| 13-2052 | Personal Financial Advisors | 1,880 | 1,350 | -28.2 | 1.19 | 0.350 | 158,910 |
| 13-1151 | Training and Development Specialists | 2,500 | 2,530 | +1.2 | 1.30 | 0.279 | 79,200 |
| 25-1071 | Health Specialties Teachers, Postsecondary | 1,480 | 1,430 | -3.4 | 1.53 | 0.304 | 130,720 |
| 15-1244 | Network and Computer Systems Administrators | 1,670 | 1,660 | -0.6 | 1.24 | 0.337 | 103,730 |
| 27-3031 | Public Relations Specialists | 1,470 | 1,760 | +19.7 | 1.46 | 0.453 | 82,880 |
| 23-2011 | Paralegals and Legal Assistants | 2,330 | 1,930 | -17.2 | 1.15 | 0.293 | 67,940 |
| 15-2031 | Operations Research Analysts | 1,300 | 1,020 | -21.5 | 2.22 | 0.429 | 105,800 |
| 15-1242 | Database Administrators | 640 | 600 | -6.2 | 2.00 | 0.332 | 102,460 |
| 15-1243 | Database Architects | 390 | 440 | +12.8 | 1.53 | 0.579 | 138,240 |
| 43-3011 | Bill and Account Collectors | 1,030 | 1,040 | +1.0 | 1.54 | 0.299 | 46,640 |
| 25-1011 | Business Teachers, Postsecondary | 410 | 400 | -2.4 | 1.16 | 0.307 | 115,140 |
| 13-2054 | Financial Risk Specialists | 400 | 380 | -5.0 | 1.40 | 0.265 | 119,620 |
| 25-1081 | Education Teachers, Postsecondary | 360 | 370 | +2.8 | 1.42 | 0.262 | 76,720 |
| 25-1042 | Biological Science Teachers, Postsecondary | 310 | 300 | -3.2 | 1.39 | 0.291 | 92,030 |
| 23-1023 | Judges, Magistrate Judges, and Magistrates | — | 220 | — | 2.11 | 0.311 | 125,220 |
| 43-4161 | Human Resources Assistants, Except Payroll and Timekeeping | 460 | 470 | +2.2 | 1.23 | 0.405 | 53,300 |
| 23-1021 | Administrative Law Judges, Adjudicators, and Hearing Officers | 210 | 210 | +0.0 | 2.96 | 0.305 | 101,970 |
| 25-1022 | Mathematical Science Teachers, Postsecondary | 210 | 230 | +9.5 | 1.11 | 0.430 | 89,340 |
| 19-4031 | Chemical Technicians | 160 | 360 | +125.0 | 1.47 | 0.315 | 55,060 |
| 25-4012 | Curators | 100 | 80 | -20.0 | 1.47 | 0.412 | 74,460 |
| 19-3022 | Survey Researchers | — | 50 | — | 1.33 | 0.432 | 87,250 |

## F. Employment change, May 2023 to May 2025

Occupations with at least 1,000 jobs in 2023, sorted by percentage change.

| SOC | Occupation | 2023 | 2024 | 2025 | Change | Change % | Exposure |
|-------|----------------------------------|------:|------:|------:|------:|--------:|--------:|
| 43-4111 | Interviewers, Except Eligibility and Loan | 1,000 | 460 | 230 | -770 | -77.0 | 0.385 |
| 27-1026 | Merchandise Displayers and Window Trimmers | 1,370 | 920 | 700 | -670 | -48.9 | 0.000 |
| 35-2011 | Cooks, Fast Food | 2,220 | 2,710 | 1,180 | -1,040 | -46.8 | 0.000 |
| 29-2072 | Medical Records Specialists | 1,130 | 1,160 | 740 | -390 | -34.5 | 0.667 |
| 43-3031 | Bookkeeping, Accounting, and Auditing Clerks | 7,170 | 6,420 | 4,890 | -2,280 | -31.8 | 0.310 |
| 13-2052 | Personal Financial Advisors | 1,880 | 1,140 | 1,350 | -530 | -28.2 | 0.350 |
| 43-4171 | Receptionists and Information Clerks | 4,890 | 4,200 | 3,550 | -1,340 | -27.4 | 0.434 |
| 43-4051 | Customer Service Representatives | 14,910 | 11,870 | 10,960 | -3,950 | -26.5 | 0.701 |
| 27-1024 | Graphic Designers | 1,000 | 960 | 760 | -240 | -24.0 | 0.367 |
| 53-3031 | Driver/Sales Workers | 1,760 | 1,500 | 1,350 | -410 | -23.3 | 0.028 |
| 15-2031 | Operations Research Analysts | 1,300 | 1,070 | 1,020 | -280 | -21.5 | 0.429 |
| 13-1051 | Cost Estimators | 1,370 | 1,150 | 1,080 | -290 | -21.2 | 0.000 |
| 29-1229 | Physicians, All Other | 2,230 | 1,530 | 1,760 | -470 | -21.1 | 0.030 |
| 43-9041 | Insurance Claims and Policy Processing Clerks | 1,930 | 1,650 | 1,530 | -400 | -20.7 | 0.147 |
| 43-6014 | Secretaries and Administrative Assistants, Except Legal, Medical, and Executive | 6,230 | 5,620 | 4,940 | -1,290 | -20.7 | 0.453 |
| 17-2051 | Civil Engineers | 2,090 | 1,720 | 1,680 | -410 | -19.6 | 0.008 |
| 23-2011 | Paralegals and Legal Assistants | 2,330 | 1,930 | 1,930 | -400 | -17.2 | 0.293 |
| 13-2072 | Loan Officers | 1,760 | 1,800 | 1,480 | -280 | -15.9 | 0.186 |
| 53-7051 | Industrial Truck and Tractor Operators | 6,090 | 6,310 | 5,150 | -940 | -15.4 | 0.000 |
| 29-2052 | Pharmacy Technicians | 2,370 | 2,120 | 2,020 | -350 | -14.8 | 0.073 |
| 43-1011 | First-Line Supervisors of Office and Administrative Support Workers | 7,510 | 6,850 | 6,490 | -1,020 | -13.6 | 0.186 |
| 15-1232 | Computer User Support Specialists | 2,690 | 2,520 | 2,350 | -340 | -12.6 | 0.469 |
| 41-1011 | First-Line Supervisors of Retail Sales Workers | 5,710 | 5,000 | 5,000 | -710 | -12.4 | 0.263 |
| 35-1012 | First-Line Supervisors of Food Preparation and Serving Workers | 5,170 | 4,370 | 4,590 | -580 | -11.2 | 0.056 |
| 43-5061 | Production, Planning, and Expediting Clerks | 1,380 | 1,310 | 1,230 | -150 | -10.9 | 0.093 |
| 43-3021 | Billing and Posting Clerks | 1,790 | 1,690 | 1,610 | -180 | -10.1 | 0.192 |
| 43-6011 | Executive Secretaries and Executive Administrative Assistants | 2,280 | 2,110 | 2,060 | -220 | -9.6 | 0.234 |
| 29-2061 | Licensed Practical and Licensed Vocational Nurses | 2,810 | 2,720 | 2,570 | -240 | -8.5 | 0.000 |
| 51-9061 | Inspectors, Testers, Sorters, Samplers, and Weighers | 1,430 | 1,410 | 1,330 | -100 | -7.0 | 0.032 |
| 13-1071 | Human Resources Specialists | 4,880 | 4,950 | 4,540 | -340 | -7.0 | 0.403 |
| 43-5052 | Postal Service Mail Carriers | 1,280 | 1,220 | 1,200 | -80 | -6.2 | 0.000 |
| 33-3012 | Correctional Officers and Jailers | 2,050 | 2,080 | 1,930 | -120 | -5.9 | 0.000 |
| 47-2061 | Construction Laborers | 4,840 | 4,740 | 4,560 | -280 | -5.8 | 0.028 |
| 29-1051 | Pharmacists | 1,430 | 1,360 | 1,350 | -80 | -5.6 | 0.090 |
| 41-2011 | Cashiers | 15,310 | 13,860 | 14,460 | -850 | -5.6 | 0.085 |
| 15-1211 | Computer Systems Analysts | 3,160 | 2,710 | 2,990 | -170 | -5.4 | 0.276 |
| 11-3021 | Computer and Information Systems Managers | 2,000 | 1,840 | 1,900 | -100 | -5.0 | 0.156 |
| 41-2021 | Counter and Rental Clerks | 2,730 | 2,870 | 2,610 | -120 | -4.4 | 0.205 |
| 53-7065 | Stockers and Order Fillers | 12,830 | 12,560 | 12,300 | -530 | -4.1 | 0.000 |
| 37-2012 | Maids and Housekeeping Cleaners | 3,410 | 3,220 | 3,280 | -130 | -3.8 | 0.000 |
| 33-9032 | Security Guards | 4,810 | 4,410 | 4,630 | -180 | -3.7 | 0.000 |
| 25-1071 | Health Specialties Teachers, Postsecondary | 1,480 | 1,460 | 1,430 | -50 | -3.4 | 0.304 |
| 39-5012 | Hairdressers, Hairstylists, and Cosmetologists | 1,710 | 1,580 | 1,660 | -50 | -2.9 | 0.030 |
| 15-1252 | Software Developers | 7,890 | 6,990 | 7,680 | -210 | -2.7 | 0.288 |
| 53-7064 | Packers and Packagers, Hand | 1,570 | 1,510 | 1,530 | -40 | -2.5 | 0.000 |
| 25-2058 | Special Education Teachers, Secondary School | 1,240 | 1,250 | 1,210 | -30 | -2.4 | 0.099 |
| 47-2073 | Operating Engineers and Other Construction Equipment Operators | 2,270 | 2,210 | 2,220 | -50 | -2.2 | 0.000 |
| 53-7062 | Laborers and Freight, Stock, and Material Movers, Hand | 10,730 | 10,490 | 10,550 | -180 | -1.7 | 0.000 |
| 39-9031 | Exercise Trainers and Group Fitness Instructors | 2,030 | 2,200 | 2,000 | -30 | -1.5 | 0.000 |
| 21-1093 | Social and Human Service Assistants | 2,080 | 1,600 | 2,050 | -30 | -1.4 | 0.000 |
| 13-1111 | Management Analysts | 6,410 | 6,370 | 6,340 | -70 | -1.1 | 0.243 |
| 41-3031 | Securities, Commodities, and Financial Services Sales Agents | 3,010 | 2,800 | 2,990 | -20 | -0.7 | 0.441 |
| 15-1244 | Network and Computer Systems Administrators | 1,670 | 1,570 | 1,660 | -10 | -0.6 | 0.337 |
| 25-2021 | Elementary School Teachers, Except Special Education | 5,300 | 5,290 | 5,270 | -30 | -0.6 | 0.103 |
| 41-3021 | Insurance Sales Agents | 2,050 | 2,480 | 2,040 | -10 | -0.5 | 0.319 |
| 25-2022 | Middle School Teachers, Except Special and Career/Technical Education | 2,770 | 2,660 | 2,760 | -10 | -0.4 | 0.297 |
| 35-2021 | Food Preparation Workers | 2,880 | 2,250 | 2,890 | +10 | +0.3 | 0.000 |
| 35-3031 | Waiters and Waitresses | 9,070 | 9,260 | 9,120 | +50 | +0.6 | 0.000 |
| 43-3011 | Bill and Account Collectors | 1,030 | 920 | 1,040 | +10 | +1.0 | 0.299 |
| 39-3091 | Amusement and Recreation Attendants | 1,680 | 1,730 | 1,700 | +20 | +1.2 | 0.062 |
| 13-1151 | Training and Development Specialists | 2,500 | 2,510 | 2,530 | +30 | +1.2 | 0.279 |
| 31-1131 | Nursing Assistants | 6,580 | 6,580 | 6,660 | +80 | +1.2 | 0.000 |
| 53-3033 | Light Truck Drivers | 4,720 | 4,500 | 4,790 | +70 | +1.5 | 0.000 |
| 49-9071 | Maintenance and Repair Workers, General | 5,420 | 5,320 | 5,520 | +100 | +1.8 | 0.000 |
| 25-9031 | Instructional Coordinators | 1,030 | 1,080 | 1,050 | +20 | +1.9 | 0.304 |
| 51-1011 | First-Line Supervisors of Production and Operating Workers | 2,160 | 2,140 | 2,210 | +50 | +2.3 | 0.000 |
| 11-2022 | Sales Managers | 1,290 | 1,520 | 1,320 | +30 | +2.3 | 0.043 |
| 43-9061 | Office Clerks, General | 10,640 | 10,180 | 10,890 | +250 | +2.3 | 0.450 |
| 15-1212 | Information Security Analysts | 1,650 | 1,550 | 1,690 | +40 | +2.4 | 0.486 |
| 53-3053 | Shuttle Drivers and Chauffeurs | 1,610 | 1,360 | 1,650 | +40 | +2.5 | 0.000 |
| 11-9032 | Education Administrators, Kindergarten through Secondary | 1,190 | 1,160 | 1,230 | +40 | +3.4 | 0.052 |
| 41-2031 | Retail Salespersons | 15,630 | 16,180 | 16,210 | +580 | +3.7 | 0.322 |
| 31-9091 | Dental Assistants | 1,550 | 1,570 | 1,610 | +60 | +3.9 | 0.000 |
| 41-4012 | Sales Representatives, Wholesale and Manufacturing, Except Technical and Scientific Products | 4,890 | 4,010 | 5,080 | +190 | +3.9 | 0.628 |
| 35-2012 | Cooks, Institution and Cafeteria | 1,490 | 1,510 | 1,550 | +60 | +4.0 | 0.000 |
| 11-9021 | Construction Managers | 1,220 | 1,230 | 1,270 | +50 | +4.1 | 0.119 |
| 49-3031 | Bus and Truck Mechanics and Diesel Engine Specialists | 1,340 | 1,380 | 1,400 | +60 | +4.5 | 0.000 |
| 37-3011 | Landscaping and Groundskeeping Workers | 4,170 | 4,390 | 4,360 | +190 | +4.6 | 0.000 |
| 49-1011 | First-Line Supervisors of Mechanics, Installers, and Repairers | 2,850 | 2,960 | 2,980 | +130 | +4.6 | 0.102 |
| 49-3023 | Automotive Service Technicians and Mechanics | 2,800 | 2,830 | 2,930 | +130 | +4.6 | 0.000 |
| 33-2011 | Firefighters | 1,930 | 1,960 | 2,020 | +90 | +4.7 | 0.000 |
| 47-1011 | First-Line Supervisors of Construction Trades and Extraction Workers | 4,260 | 4,370 | 4,460 | +200 | +4.7 | 0.030 |
| 21-1021 | Child, Family, and School Social Workers | 1,460 | 1,420 | 1,530 | +70 | +4.8 | 0.007 |
| 47-2111 | Electricians | 3,430 | 3,300 | 3,600 | +170 | +5.0 | 0.000 |
| 13-1199 | Business Operations Specialists, All Other | 5,600 | 6,040 | 5,880 | +280 | +5.0 | 0.185 |
| 13-2011 | Accountants and Auditors | 7,540 | 7,920 | 7,920 | +380 | +5.0 | 0.348 |
| 35-3023 | Fast Food and Counter Workers | 16,180 | 16,920 | 17,100 | +920 | +5.7 | 0.000 |
| 41-1012 | First-Line Supervisors of Non-Retail Sales Workers | 1,390 | 1,430 | 1,470 | +80 | +5.8 | 0.230 |
| 49-9041 | Industrial Machinery Mechanics | 1,790 | 1,900 | 1,900 | +110 | +6.1 | 0.024 |
| 29-1123 | Physical Therapists | 1,220 | 1,160 | 1,300 | +80 | +6.6 | 0.017 |
| 35-2014 | Cooks, Restaurant | 5,760 | 6,210 | 6,160 | +400 | +6.9 | 0.012 |
| 21-1012 | Educational, Guidance, and Career Counselors and Advisors | 1,380 | 1,470 | 1,480 | +100 | +7.2 | 0.118 |
| 35-9031 | Hosts and Hostesses, Restaurant, Lounge, and Coffee Shop | 1,560 | 1,640 | 1,680 | +120 | +7.7 | 0.073 |
| 15-1299 | Computer Occupations, All Other | 1,180 | 1,130 | 1,280 | +100 | +8.5 | 0.311 |
| 11-9111 | Medical and Health Services Managers | 1,620 | 1,750 | 1,760 | +140 | +8.6 | 0.066 |
| 51-9111 | Packaging and Filling Machine Operators and Tenders | 1,230 | 1,410 | 1,340 | +110 | +8.9 | 0.000 |
| 37-2011 | Janitors and Cleaners, Except Maids and Housekeeping Cleaners | 8,500 | 9,630 | 9,270 | +770 | +9.1 | 0.000 |
| 25-2031 | Secondary School Teachers, Except Special and Career/Technical Education | 4,030 | 4,240 | 4,420 | +390 | +9.7 | 0.290 |
| 49-9021 | Heating, Air Conditioning, and Refrigeration Mechanics and Installers | 2,460 | 2,430 | 2,700 | +240 | +9.8 | 0.019 |
| 29-1171 | Nurse Practitioners | 1,310 | 1,100 | 1,440 | +130 | +9.9 | 0.094 |
| 53-3051 | Bus Drivers, School | 1,880 | 1,940 | 2,070 | +190 | +10.1 | 0.000 |
| 53-7061 | Cleaners of Vehicles and Equipment | 1,160 | 1,270 | 1,280 | +120 | +10.3 | 0.000 |
| 53-3032 | Heavy and Tractor-Trailer Truck Drivers | 10,570 | 13,080 | 11,760 | +1,190 | +11.3 | 0.000 |
| 39-9011 | Childcare Workers | 2,330 | 2,630 | 2,610 | +280 | +12.0 | 0.012 |
| 11-3031 | Financial Managers | 3,100 | 3,410 | 3,480 | +380 | +12.3 | 0.391 |
| 51-4121 | Welders, Cutters, Solderers, and Brazers | 1,120 | 1,240 | 1,260 | +140 | +12.5 | 0.000 |
| 23-1011 | Lawyers | 3,340 | 3,710 | 3,780 | +440 | +13.2 | 0.167 |
| 39-2021 | Animal Caretakers | 1,360 | 1,430 | 1,540 | +180 | +13.2 | 0.000 |
| 33-3051 | Police and Sheriff's Patrol Officers | 3,010 | 3,240 | 3,410 | +400 | +13.3 | 0.123 |
| 35-3011 | Bartenders | 1,860 | 2,640 | 2,110 | +250 | +13.4 | 0.000 |
| 29-1141 | Registered Nurses | 13,740 | 15,440 | 15,700 | +1,960 | +14.3 | 0.059 |
| 11-1021 | General and Operations Managers | 13,680 | 14,720 | 15,770 | +2,090 | +15.3 | 0.138 |
| 35-3041 | Food Servers, Nonrestaurant | 1,070 | 1,240 | 1,250 | +180 | +16.8 | 0.000 |
| 11-9199 | Managers, All Other | 1,760 | 1,960 | 2,060 | +300 | +17.0 | 0.069 |
| 47-2031 | Carpenters | 2,580 | 2,910 | 3,070 | +490 | +19.0 | 0.000 |
| 25-3021 | Self-Enrichment Teachers | 1,210 | 1,230 | 1,440 | +230 | +19.0 | 0.066 |
| 27-3031 | Public Relations Specialists | 1,470 | 1,580 | 1,760 | +290 | +19.7 | 0.453 |
| 13-2051 | Financial and Investment Analysts | 1,360 | 1,420 | 1,630 | +270 | +19.9 | 0.572 |
| 47-2152 | Plumbers, Pipefitters, and Steamfitters | 1,940 | 2,060 | 2,340 | +400 | +20.6 | 0.012 |
| 39-9032 | Recreation Workers | 1,090 | 1,350 | 1,320 | +230 | +21.1 | 0.000 |
| 41-2022 | Parts Salespersons | 1,090 | 1,310 | 1,320 | +230 | +21.1 | 0.000 |
| 13-1161 | Market Research Analysts and Marketing Specialists | 3,720 | 4,100 | 4,550 | +830 | +22.3 | 0.648 |
| 13-1081 | Logisticians | 1,090 | 1,060 | 1,340 | +250 | +22.9 | 0.157 |
| 31-9092 | Medical Assistants | 2,560 | 2,740 | 3,210 | +650 | +25.4 | 0.048 |
| 35-9021 | Dishwashers | 1,550 | 1,800 | 1,980 | +430 | +27.7 | 0.000 |
| 13-1041 | Compliance Officers | 2,250 | 2,490 | 2,910 | +660 | +29.3 | 0.121 |
| 43-5071 | Shipping, Receiving, and Inventory Clerks | 3,260 | 3,850 | 4,420 | +1,160 | +35.6 | 0.000 |
| 35-9011 | Dining Room and Cafeteria Attendants and Bartender Helpers | 1,210 | 1,370 | 1,790 | +580 | +47.9 | 0.000 |
| 13-1031 | Claims Adjusters, Examiners, and Investigators | 1,210 | 1,560 | 1,790 | +580 | +47.9 | 0.082 |
| 25-2011 | Preschool Teachers, Except Special Education | 1,390 | 1,900 | 2,060 | +670 | +48.2 | 0.000 |
| 43-6013 | Medical Secretaries and Administrative Assistants | 2,240 | 3,370 | 4,140 | +1,900 | +84.8 | 0.362 |

## G. Decomposition of the Richmond–national exposure gap

Contribution is the exposure score times the difference between Richmond and
national employment shares, in units of 1e-4 exposure points. Positive values
widen Richmond's gap above the nation; negative values narrow it.

| SOC | Occupation | RVA emp | RVA % | Nat % | Exposure | Contribution |
|-------|----------------------------------|-------:|------:|------:|--------:|------------:|
| 13-1111 | Management Analysts | 6,340 | 1.09 | 0.66 | 0.243 | +10.36 |
| 13-2011 | Accountants and Auditors | 7,920 | 1.36 | 1.07 | 0.348 | +10.11 |
| 13-1161 | Market Research Analysts and Marketing Specialists | 4,550 | 0.78 | 0.66 | 0.648 | +7.65 |
| 15-1212 | Information Security Analysts | 1,690 | 0.29 | 0.14 | 0.486 | +7.25 |
| 41-3031 | Securities, Commodities, and Financial Services Sales Agents | 2,990 | 0.51 | 0.36 | 0.441 | +6.71 |
| 13-1071 | Human Resources Specialists | 4,540 | 0.78 | 0.67 | 0.403 | +4.31 |
| 27-3031 | Public Relations Specialists | 1,760 | 0.30 | 0.21 | 0.453 | +4.22 |
| 15-2031 | Operations Research Analysts | 1,020 | 0.17 | 0.08 | 0.429 | +4.07 |
| 13-1199 | Business Operations Specialists, All Other | 5,880 | 1.01 | 0.80 | 0.185 | +3.84 |
| 15-1211 | Computer Systems Analysts | 2,990 | 0.51 | 0.38 | 0.276 | +3.60 |
| 41-2021 | Counter and Rental Clerks | 2,610 | 0.45 | 0.29 | 0.205 | +3.12 |
| 13-1151 | Training and Development Specialists | 2,530 | 0.43 | 0.34 | 0.279 | +2.69 |
| 25-1071 | Health Specialties Teachers, Postsecondary | 1,430 | 0.24 | 0.16 | 0.304 | +2.50 |
| 43-9061 | Office Clerks, General | 10,890 | 1.86 | 1.81 | 0.450 | +2.39 |
| 13-1041 | Compliance Officers | 2,910 | 0.50 | 0.31 | 0.121 | +2.32 |
| 41-1012 | First-Line Supervisors of Non-Retail Sales Workers | 1,470 | 0.25 | 0.16 | 0.230 | +2.16 |
| 15-1252 | Software Developers | 7,680 | 1.32 | 1.24 | 0.288 | +2.15 |
| 43-3011 | Bill and Account Collectors | 1,040 | 0.18 | 0.12 | 0.299 | +1.83 |
| 15-1244 | Network and Computer Systems Administrators | 1,660 | 0.28 | 0.23 | 0.337 | +1.79 |
| 41-2011 | Cashiers | 14,460 | 2.48 | 2.27 | 0.085 | +1.74 |
| 43-6014 | Secretaries and Administrative Assistants, Except Legal, Medical, and Executive | 4,940 | 0.85 | 1.25 | 0.453 | -18.50 |
| 15-1232 | Computer User Support Specialists | 2,350 | 0.40 | 0.53 | 0.469 | -5.84 |
| 43-3031 | Bookkeeping, Accounting, and Auditing Clerks | 4,890 | 0.84 | 1.01 | 0.310 | -5.35 |
| 11-2021 | Marketing Managers | 1,090 | 0.19 | 0.29 | 0.320 | -3.32 |
| 15-1299 | Computer Occupations, All Other | 1,280 | 0.22 | 0.32 | 0.311 | -3.13 |
| 41-2031 | Retail Salespersons | 16,210 | 2.78 | 2.86 | 0.322 | -2.87 |
| 43-4111 | Interviewers, Except Eligibility and Loan | 230 | 0.04 | 0.11 | 0.385 | -2.67 |
| 43-4171 | Receptionists and Information Clerks | 3,550 | 0.61 | 0.67 | 0.434 | -2.65 |
| 11-3021 | Computer and Information Systems Managers | 1,900 | 0.33 | 0.49 | 0.156 | -2.61 |
| 41-4012 | Sales Representatives, Wholesale and Manufacturing, Except Technical and Scientific Products | 5,080 | 0.87 | 0.91 | 0.628 | -2.52 |
| 43-4051 | Customer Service Representatives | 10,960 | 1.88 | 1.91 | 0.701 | -2.18 |
| 43-4181 | Reservation and Transportation Ticket Agents and Travel Clerks | 120 | 0.02 | 0.09 | 0.247 | -1.65 |
| 25-2021 | Elementary School Teachers, Except Special Education | 5,270 | 0.90 | 1.02 | 0.103 | -1.22 |
| 11-9141 | Property, Real Estate, and Community Association Managers | 920 | 0.16 | 0.23 | 0.165 | -1.18 |
| 15-1251 | Computer Programmers | 310 | 0.05 | 0.07 | 0.745 | -1.10 |
| 29-2072 | Medical Records Specialists | 740 | 0.13 | 0.14 | 0.667 | -1.09 |
| 15-1255 | Web and Digital Interface Designers | 230 | 0.04 | 0.08 | 0.249 | -1.09 |
| 11-2022 | Sales Managers | 1,320 | 0.23 | 0.47 | 0.043 | -1.05 |
| 41-4011 | Sales Representatives, Wholesale and Manufacturing, Technical and Scientific Products | 1,010 | 0.17 | 0.21 | 0.271 | -0.98 |
| 41-3041 | Travel Agents | 100 | 0.02 | 0.04 | 0.405 | -0.95 |

## H. Zero-exposure occupations with scale

Of the 756 occupations in the exposure dataset, 411 — 54.4% — score exactly zero. Within the Richmond matched set, 248 occupations covering 225,650 jobs (38.6% of analyzed employment) carry a zero score.

A zero indicates the occupation did not appear in the sampled interactions. It is
not evidence that the occupation is insulated. Absorption candidates are drawn
from this group and inherit the caveat.

| SOC | Occupation | Employment | LQ | Mean wage |
|-------|----------------------------------|----------:|------:|---------:|
| 51-1011 | First-Line Supervisors of Production and Operating Workers | 2,210 | 0.77 | 77,140 |
| 29-2061 | Licensed Practical and Licensed Vocational Nurses | 2,570 | 0.93 | 66,110 |
| 33-2011 | Firefighters | 2,020 | 1.37 | 62,440 |
| 47-2111 | Electricians | 3,600 | 1.12 | 62,360 |
| 49-3023 | Automotive Service Technicians and Mechanics | 2,930 | 0.98 | 61,160 |
| 53-3032 | Heavy and Tractor-Trailer Truck Drivers | 11,760 | 1.34 | 60,130 |
| 47-2073 | Operating Engineers and Other Construction Equipment Operators | 2,220 | 1.09 | 56,620 |
| 47-2031 | Carpenters | 3,070 | 1.08 | 53,520 |
| 49-9071 | Maintenance and Repair Workers, General | 5,520 | 0.85 | 52,520 |
| 35-3011 | Bartenders | 2,110 | 0.66 | 51,750 |
| 53-3051 | Bus Drivers, School | 2,070 | 1.21 | 49,290 |
| 53-7051 | Industrial Truck and Tractor Operators | 5,150 | 1.56 | 48,530 |
| 43-5071 | Shipping, Receiving, and Inventory Clerks | 4,420 | 1.28 | 45,020 |
| 35-3031 | Waiters and Waitresses | 9,120 | 0.95 | 45,010 |
| 39-9031 | Exercise Trainers and Group Fitness Instructors | 2,000 | 1.46 | 44,280 |
| 53-3033 | Light Truck Drivers | 4,790 | 1.15 | 44,220 |
| 21-1093 | Social and Human Service Assistants | 2,050 | 1.10 | 44,190 |
| 33-9032 | Security Guards | 4,630 | 0.85 | 42,150 |
| 53-7062 | Laborers and Freight, Stock, and Material Movers, Hand | 10,550 | 0.84 | 42,130 |
| 31-1131 | Nursing Assistants | 6,660 | 1.08 | 41,770 |
| 37-3011 | Landscaping and Groundskeeping Workers | 4,360 | 1.08 | 39,940 |
| 25-2011 | Preschool Teachers, Except Special Education | 2,060 | 1.01 | 38,980 |
| 53-7065 | Stockers and Order Fillers | 12,300 | 1.02 | 38,260 |
| 37-2011 | Janitors and Cleaners, Except Maids and Housekeeping Cleaners | 9,270 | 0.99 | 35,220 |
| 35-2021 | Food Preparation Workers | 2,890 | 0.76 | 34,120 |
| 37-2012 | Maids and Housekeeping Cleaners | 3,280 | 0.90 | 33,850 |
| 35-3023 | Fast Food and Counter Workers | 17,100 | 1.04 | 31,080 |

## I. Distribution of exposure across Richmond employment

| Exposure band | Occs | Employment | % of employment | % of exposure | Mean wage |
|-------------|------:|----------:|---------------:|-------------:|---------:|
| exactly 0 | 248 | 225,650 | 38.6 | 0.0 | 50,239 |
| 0–0.05 | 71 | 59,940 | 10.3 | 2.0 | 75,387 |
| 0.05–0.10 | 54 | 67,050 | 11.5 | 6.1 | 74,948 |
| 0.10–0.25 | 79 | 87,750 | 15.0 | 18.2 | 95,066 |
| 0.25–0.40 | 43 | 81,900 | 14.0 | 32.4 | 83,015 |
| 0.40–0.60 | 22 | 39,620 | 6.8 | 22.5 | 70,731 |
| 0.60+ | 6 | 22,120 | 3.8 | 18.7 | 65,346 |

## J. Reproduction

```
python3 scripts/rebase_2025.py        # 2025 base, national gap
python3 scripts/national_benchmark.py # office-support shortfall
python3 scripts/findings.py           # figures for both findings
python3 scripts/build_appendix.py     # regenerate this appendix
```

Requires `pandas` and `openpyxl`. The OEWS archives listed in section A must be
present under `data/`.

Complete occupation-level output is in `output/richmond_exposure_2025.csv`
(523 rows), `output/richmond_three_point.csv` (487 rows), and
`output/national_gap_decomposition.csv` (523 rows).
