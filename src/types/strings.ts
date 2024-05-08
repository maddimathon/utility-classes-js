/**
 * Some utility types for strings.
 * 
 * @package @maddimathon/utility-classes@{{CURRENT_VERSION}}
 * @author Maddi Mathon (www.maddimathon.com)
 * @link {{CURRENT_URL}}
 * 
 * @license MIT
 * 
 * @since 1.0.0
 */
/*!
 * @package @maddimathon/utility-classes@{{CURRENT_VERSION}}
 * @link {{CURRENT_URL}}
 * @license MIT
 */



/** # TUPLES
 ** ======================================================================== **/

/**
 * @type  All valid ISO country codes.
 * Updated 2024-02-16 from {@link https://www.w3schools.com/tags/ref_country_codes.asp}
 */
type CountryCode = "AF" | "AL" | "DZ" | "AS" | "AD" | "AO" | "AQ" | "AG"
    | "AR" | "AM" | "AW" | "AU" | "AT" | "AZ" | "BS" | "BH" | "BD" | "BB" | "BY"
    | "BE" | "BZ" | "BJ" | "BM" | "BT" | "BO" | "BA" | "BW" | "BV" | "BR" | "IO"
    | "BN" | "BG" | "BF" | "BI" | "KH" | "CM" | "CA" | "CV" | "KY" | "CF" | "TD"
    | "CL" | "CN" | "CX" | "CC" | "CO" | "KM" | "CG" | "CD" | "CK" | "CR" | "CI"
    | "HR" | "CU" | "CY" | "CZ" | "DK" | "DJ" | "DM" | "DO" | "EC" | "EG" | "SV"
    | "GQ" | "ER" | "EE" | "ET" | "FK" | "FO" | "FJ" | "FI" | "FR" | "GF" | "PF"
    | "TF" | "GA" | "GM" | "GE" | "DE" | "GH" | "GI" | "GR" | "GL" | "GD" | "GP"
    | "GU" | "GT" | "GN" | "GW" | "GY" | "HT" | "HM" | "HN" | "HK" | "HU" | "IS"
    | "IN" | "ID" | "IR" | "IQ" | "IE" | "IL" | "IT" | "JM" | "JP" | "JO" | "KZ"
    | "KE" | "KI" | "KP" | "KR" | "KW" | "KG" | "LA" | "LV" | "LB" | "LS" | "LR"
    | "LY" | "LI" | "LT" | "LU" | "MO" | "MK" | "MG" | "MW" | "MY" | "MV" | "ML"
    | "MT" | "MH" | "MQ" | "MR" | "MU" | "YT" | "MX" | "FM" | "MD" | "MC" | "MN"
    | "ME" | "MS" | "MA" | "MZ" | "MM" | "NA" | "NR" | "NP" | "NL" | "AN" | "NC"
    | "NZ" | "NI" | "NE" | "NG" | "NU" | "NF" | "MP" | "NO" | "OM" | "PK" | "PW"
    | "PS" | "PA" | "PG" | "PY" | "PE" | "PH" | "PN" | "PL" | "PT" | "PR" | "QA"
    | "RE" | "RO" | "RU" | "RW" | "SH" | "KN" | "LC" | "PM" | "VC" | "WS" | "SM"
    | "ST" | "SA" | "SN" | "RS" | "SC" | "SL" | "SG" | "SK" | "SI" | "SB" | "SO"
    | "ZA" | "GS" | "SS" | "ES" | "LK" | "SD" | "SR" | "SJ" | "SZ" | "SE" | "CH"
    | "SY" | "TW" | "TJ" | "TZ" | "TH" | "TL" | "TG" | "TK" | "TO" | "TT" | "TN"
    | "TR" | "TM" | "TC" | "TV" | "UG" | "UA" | "AE" | "GB" | "US" | "UM" | "UY"
    | "UZ" | "VU" | "VE" | "VN" | "VG" | "VI" | "WF" | "EH" | "YE" | "ZM" | "ZW";

/**
 * @type  All valid ISO language codes (without locales).
 * Updated 2024-02-16 from {@link https://www.w3schools.com/tags/ref_language_codes.asp}
 */
type LangCode = "ab" | "aa" | "af" | "ak" | "sq" | "am" | "ar" | "an"
    | "hy" | "as" | "av" | "ae" | "ay" | "az" | "bm" | "ba" | "eu" | "be" | "bn"
    | "bh" | "bi" | "bs" | "br" | "bg" | "my" | "ca" | "ch" | "ce" | "ny" | "zh"
    | "zh-Hans" | "zh-Hant" | "cv" | "kw" | "co" | "cr" | "hr" | "cs" | "da"
    | "dv" | "nl" | "dz" | "en" | "eo" | "et" | "ee" | "fo" | "fj" | "fi" | "fr"
    | "ff" | "gl" | "gd" | "gv" | "ka" | "de" | "el" | "kl" | "gn" | "gu" | "ht"
    | "ha" | "he" | "hz" | "hi" | "ho" | "hu" | "is" | "io" | "ig" | "id" | "in"
    | "ia" | "ie" | "iu" | "ik" | "ga" | "it" | "ja" | "jv" | "kl" | "kn" | "kr"
    | "ks" | "kk" | "km" | "ki" | "rw" | "rn" | "ky" | "kv" | "kg" | "ko" | "ku"
    | "kj" | "lo" | "la" | "lv" | "li" | "ln" | "lt" | "lu" | "lg" | "lb" | "gv"
    | "mk" | "mg" | "ms" | "ml" | "mt" | "mi" | "mr" | "mh" | "mo" | "mn" | "na"
    | "nv" | "ng" | "nd" | "ne" | "no" | "nb" | "nn" | "ii" | "oc" | "oj" | "cu"
    | "or" | "om" | "os" | "pi" | "ps" | "fa" | "pl" | "pt" | "pa" | "qu" | "rm"
    | "ro" | "ru" | "se" | "sm" | "sg" | "sa" | "sr" | "sh" | "st" | "tn" | "sn"
    | "ii" | "sd" | "si" | "ss" | "sk" | "sl" | "so" | "nr" | "es" | "su" | "sw"
    | "ss" | "sv" | "tl" | "ty" | "tg" | "ta" | "tt" | "te" | "th" | "bo" | "ti"
    | "to" | "ts" | "tr" | "tk" | "tw" | "ug" | "uk" | "ur" | "uz" | "ve" | "vi"
    | "vo" | "wa" | "cy" | "wo" | "fy" | "xh" | "yi" | "ji" | "yo" | "za" | "zu";

/**
 * @type  A BCP 47 language tag, `LangCode` & `CountryCode` with a dash between.
 * Updated 2024-02-16 from {@link https://www.w3schools.com/tags/ref_language_codes.asp}
 */
type LangLocaleCode = `${ LangCode }-${ CountryCode }`;



/** # EXPORT
 ** ======================================================================== **/

export type {
    CountryCode,
    LangCode,
    LangLocaleCode,
};