/*
 * Copyright (c) 2006 Ho Ngoc Duc. All Rights Reserved.
 * Astronomical algorithms from the book "Astronomical Algorithms" by Jean Meeus, 1998
 *
 * Ported to ESM for Nuxt.js
 */
const PI = Math.PI;

/** Discard the fractional part of a number, e.g., INT(3.2) = 3 */
function INT(d) {
	return Math.floor(d);
}

/** Compute the (integral) Julian day number of day dd/mm/yyyy, i.e., the number
 * of days between 1/1/4713 BC (Julian calendar) and dd/mm/yyyy.
 * Formula from http://www.tondering.dk/claus/calendar.html
 */
function jdFromDate(dd, mm, yy) {
	var a, y, m, jd;
	a = INT((14 - mm) / 12);
	y = yy + 4800 - a;
	m = mm + 12 * a - 3;
	jd = dd + INT((153 * m + 2) / 5) + 365 * y + INT(y / 4) - INT(y / 100) + INT(y / 400) - 32045;
	if (jd < 2299161) {
		jd = dd + INT((153 * m + 2) / 5) + 365 * y + INT(y / 4) - 32083;
	}
	return jd;
}

/** Convert a Julian day number to day/month/year. Parameter jd is an integer */
function jdToDate(jd) {
	var a, b, c, d, e, m, day, month, year;
	if (jd > 2299160) {
		// After 5/10/1582, Gregorian calendar
		a = jd + 32044;
		b = INT((4 * a + 3) / 146097);
		c = a - INT((b * 146097) / 4);
	} else {
		b = 0;
		c = jd + 32082;
	}
	d = INT((4 * c + 3) / 1461);
	e = c - INT((1461 * d) / 4);
	m = INT((5 * e + 2) / 153);
	day = e - INT((153 * m + 2) / 5) + 1;
	month = m + 3 - 12 * INT(m / 10);
	year = b * 100 + d - 4800 + INT(m / 10);
	return new Array(day, month, year);
}

/**
 * Compute the time of the k-th new moon after the new moon of 1/1/1900 13:52 UCT
 * (measured as the number of days since 1/1/4713 BC noon UCT).
 */
function NewMoon(k) {
	var T, T2, T3, dr, Jd1, M, Mpr, F, C1, deltat, JdNew;
	T = k / 1236.85; // Time in Julian centuries from 1900 January 0.5
	T2 = T * T;
	T3 = T2 * T;
	dr = PI / 180;
	Jd1 = 2415020.75933 + 29.53058868 * k + 0.0001178 * T2 - 0.000000155 * T3;
	Jd1 = Jd1 + 0.00033 * Math.sin((166.56 + 132.87 * T - 0.009173 * T2) * dr); // Mean new moon
	M = 359.2242 + 29.10535608 * k - 0.0000333 * T2 - 0.00000347 * T3; // Sun's mean anomaly
	Mpr = 306.0253 + 385.81691806 * k + 0.0107306 * T2 + 0.00001236 * T3; // Moon's mean anomaly
	F = 21.2964 + 390.67050646 * k - 0.0016528 * T2 - 0.00000239 * T3; // Moon's argument of latitude
	C1 = (0.1734 - 0.000393 * T) * Math.sin(M * dr) + 0.0021 * Math.sin(2 * dr * M);
	C1 = C1 - 0.4068 * Math.sin(Mpr * dr) + 0.0161 * Math.sin(dr * 2 * Mpr);
	C1 = C1 - 0.0004 * Math.sin(dr * 3 * Mpr);
	C1 = C1 + 0.0104 * Math.sin(dr * 2 * F) - 0.0051 * Math.sin(dr * (M + Mpr));
	C1 = C1 - 0.0074 * Math.sin(dr * (M - Mpr)) + 0.0004 * Math.sin(dr * (2 * F + M));
	C1 = C1 - 0.0004 * Math.sin(dr * (2 * F - M)) - 0.0006 * Math.sin(dr * (2 * F + Mpr));
	C1 = C1 + 0.001 * Math.sin(dr * (2 * F - Mpr)) + 0.0005 * Math.sin(dr * (2 * Mpr + M));
	if (T < -11) {
		deltat = 0.001 + 0.000839 * T + 0.0002261 * T2 - 0.00000845 * T3 - 0.000000081 * T * T3;
	} else {
		deltat = -0.000278 + 0.000265 * T + 0.000262 * T2;
	}
	JdNew = Jd1 + C1 - deltat;
	return JdNew;
}

/**
 * Compute the longitude of the sun at any time.
 */
function SunLongitude(jdn) {
	var T, T2, dr, M, L0, DL, L;
	T = (jdn - 2451545.0) / 36525; // Time in Julian centuries from 2000-01-01 12:00:00 GMT
	T2 = T * T;
	dr = PI / 180; // degree to radian
	M = 357.5291 + 35999.0503 * T - 0.0001559 * T2 - 0.00000048 * T * T2; // mean anomaly, degree
	L0 = 280.46645 + 36000.76983 * T + 0.0003032 * T2; // mean longitude, degree
	DL = (1.9146 - 0.004817 * T - 0.000014 * T2) * Math.sin(dr * M);
	DL = DL + (0.019993 - 0.000101 * T) * Math.sin(dr * 2 * M) + 0.00029 * Math.sin(dr * 3 * M);
	L = L0 + DL; // true longitude, degree
	L = L * dr;
	L = L - PI * 2 * INT(L / (PI * 2)); // Normalize to (0, 2*PI)
	return L;
}

function getSunLongitude(dayNumber, timeZone) {
	return INT((SunLongitude(dayNumber - 0.5 - timeZone / 24) / PI) * 6);
}

function getNewMoonDay(k, timeZone) {
	return INT(NewMoon(k) + 0.5 + timeZone / 24);
}

function getLunarMonth11(yy, timeZone) {
	var k, off, nm, sunLong;
	off = jdFromDate(31, 12, yy) - 2415021;
	k = INT(off / 29.530588853);
	nm = getNewMoonDay(k, timeZone);
	sunLong = getSunLongitude(nm, timeZone); // sun longitude at local midnight
	if (sunLong >= 9) {
		nm = getNewMoonDay(k - 1, timeZone);
	}
	return nm;
}

function getLeapMonthOffset(a11, timeZone) {
	var k, last, arc, i;
	k = INT((a11 - 2415021.076998695) / 29.530588853 + 0.5);
	last = 0;
	i = 1;
	arc = getSunLongitude(getNewMoonDay(k + i, timeZone), timeZone);
	do {
		last = arc;
		i++;
		arc = getSunLongitude(getNewMoonDay(k + i, timeZone), timeZone);
	} while (arc != last && i < 14);
	return i - 1;
}

/**
 * Convert solar date dd/mm/yyyy to the corresponding lunar date
 * @return {[lunarDay: number, lunarMonth: number, lunarYear: number, lunarLeap: 0 | 1, julianDay: number]} lunar date
 */
export function convertSolar2Lunar(dd, mm, yy, timeZone = 7) {
	var k, dayNumber, monthStart, a11, b11, lunarDay, lunarMonth, lunarYear, lunarLeap;
	dayNumber = jdFromDate(dd, mm, yy);
	k = INT((dayNumber - 2415021.076998695) / 29.530588853);
	monthStart = getNewMoonDay(k + 1, timeZone);
	if (monthStart > dayNumber) {
		monthStart = getNewMoonDay(k, timeZone);
	}
	a11 = getLunarMonth11(yy, timeZone);
	b11 = a11;
	if (a11 >= monthStart) {
		lunarYear = yy;
		a11 = getLunarMonth11(yy - 1, timeZone);
	} else {
		lunarYear = yy + 1;
		b11 = getLunarMonth11(yy + 1, timeZone);
	}
	lunarDay = dayNumber - monthStart + 1;
	var diff = INT((monthStart - a11) / 29);
	lunarLeap = 0;
	lunarMonth = diff + 11;
	if (b11 - a11 > 365) {
		var leapMonthDiff = getLeapMonthOffset(a11, timeZone);
		if (diff >= leapMonthDiff) {
			lunarMonth = diff + 10;
			if (diff == leapMonthDiff) {
				lunarLeap = 1;
			}
		}
	}
	if (lunarMonth > 12) {
		lunarMonth = lunarMonth - 12;
	}
	if (lunarMonth >= 11 && diff < 4) {
		lunarYear -= 1;
	}
	return [lunarDay, lunarMonth, lunarYear, lunarLeap, dayNumber];
}

/**
 * Convert a lunar date to the corresponding solar date
 */
export function convertLunar2Solar(lunarDay, lunarMonth, lunarYear, lunarLeap, timeZone = 7) {
	var k, a11, b11, off, leapOff, leapMonth, monthStart;
	if (lunarMonth < 11) {
		a11 = getLunarMonth11(lunarYear - 1, timeZone);
		b11 = getLunarMonth11(lunarYear, timeZone);
	} else {
		a11 = getLunarMonth11(lunarYear, timeZone);
		b11 = getLunarMonth11(lunarYear + 1, timeZone);
	}
	k = INT(0.5 + (a11 - 2415021.076998695) / 29.530588853);
	off = lunarMonth - 11;
	if (off < 0) {
		off += 12;
	}
	if (b11 - a11 > 365) {
		leapOff = getLeapMonthOffset(a11, timeZone);
		leapMonth = leapOff - 2;
		if (leapMonth < 0) {
			leapMonth += 12;
		}
		if (lunarLeap != 0 && lunarMonth != leapMonth) {
			return new Array(0, 0, 0);
		} else if (lunarLeap != 0 || off >= leapOff) {
			off += 1;
		}
	}
	monthStart = getNewMoonDay(k + off, timeZone);
	return jdToDate(monthStart + lunarDay - 1);
}

export const TUAN = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
export const THANG = ["Giêng", "Hai", "Ba", "Tư", "Năm", "Sáu", "Bảy", "Tám", "Chín", "Mười", "Mười Một", "Chạp"];
import { CAN, CHI, getYearCanChi, getCanHour0, getGioHoangDao, isHoangDaoDay, isHacDaoDay } from './lunarAstrology.js';
import { TIETKHI, TIETKHI_PARAGRAPHS } from './lunarSolarTerms.js';
import { getHoliday, getDaysInLunarMonth12, solarHolidays, lunarHolidays, HOLIDAY_PARAGRAPHS } from './lunarHolidays.js';

export function getSolarTerm(dayNumber, timeZone = 7) {
	return INT((SunLongitude(dayNumber - 0.5 - timeZone / 24.0) / PI) * 12);
}

/**
 * Get detailed calendar data for a solar date
 */
export function getLunarDayInfo(solarDate, timeZone = 7) {
	const dd = solarDate.getDate();
	const mm = solarDate.getMonth() + 1;
	const yy = solarDate.getFullYear();

	const lunarDay = convertSolar2Lunar(dd, mm, yy, timeZone);
	const [ldd, lmm, lyy, leap, jd] = lunarDay;

	const nhuan = leap == 1 ? ' nhuận' : '';
	const monthName = 'Tháng ' + THANG[lmm - 1] + nhuan;

	const yearCanChi = getYearCanChi(lyy);
	const monthCanChi = CAN[(lyy * 12 + lmm + 3) % 10] + ' ' + CHI[(lmm + 1) % 12];
	const dayCanChi = CAN[(jd + 9) % 10] + ' ' + CHI[(jd + 1) % 12];
	const hourCanChi0 = getCanHour0(jd) + ' ' + CHI[0];

	const termIndex = getSolarTerm(jd + 1, timeZone);
	const tietKhi = TIETKHI[termIndex];
	const tietKhiParagraph = TIETKHI_PARAGRAPHS[tietKhi] || "Ngày này rơi vào thời điểm chuyển giao thời tiết trong năm. Quý bản mệnh nên chú ý sinh hoạt điều độ, giữ tâm lý thoải mái và ăn uống đầy đủ dưỡng chất để bảo vệ sức đề kháng.";
	const hoangDaoList = getGioHoangDao(jd);

	// Day of week
	const dayOfWeek = TUAN[solarDate.getDay()];

	// Day-level Hoang Dao / Hac Dao
	const dayChiIndex = (jd + 1) % 12;
	const isHoangDao = isHoangDaoDay(lmm, dayChiIndex);
	const isHacDao = isHacDaoDay(lmm, dayChiIndex);
	const dayType = isHoangDao ? 'Hoàng đạo' : (isHacDao ? 'Hắc đạo' : 'Bình thường');

	// Calculate holiday & holidayParagraph
	const holidayNames = [];
	const sH = solarHolidays.find(h => h.day === dd && h.month === mm);
	if (sH) holidayNames.push(sH.name);
	if (leap !== 1) {
		if (lmm === 12) {
			const daysInDec = getDaysInLunarMonth12(lyy);
			if ((daysInDec === 29 && ldd === 29) || (daysInDec === 30 && ldd === 30)) {
				holidayNames.push('Giao thừa');
			}
		}
		const lH = lunarHolidays.find(h => h.day === ldd && h.month === lmm);
		if (lH) holidayNames.push(lH.name);
	}
	const holiday = holidayNames.length > 0 ? holidayNames.join(' / ') : null;
	const holidayParagraph = holidayNames
		.map(name => HOLIDAY_PARAGRAPHS[name])
		.filter(Boolean)
		.join(' ');

	return {
		solarDay: dd,
		solarMonth: mm,
		solarYear: yy,
		dayOfWeek,
		lunarDay: ldd,
		lunarMonth: lmm,
		lunarYear: lyy,
		isLeap: leap === 1,
		monthName,
		yearCanChi,
		monthCanChi,
		dayCanChi,
		hourCanChi0,
		tietKhi,
		tietKhiParagraph,
		hoangDaoList,
		dayType,
		isHoangDao,
		isHacDao,
		holiday,
		holidayParagraph,
		jd
	};
}

export { jdFromDate, jdToDate };
export { CAN, CHI, getYearCanChi, getCanHour0, getGioHoangDao, isHoangDaoDay, isHacDaoDay } from './lunarAstrology.js';
export { getHoliday, getDaysInLunarMonth12, solarHolidays, lunarHolidays, HOLIDAY_PARAGRAPHS } from './lunarHolidays.js';
