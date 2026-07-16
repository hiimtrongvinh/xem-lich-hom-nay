export const CAN = ["Giáp", "Ất", "Bính", "Đinh", "Mậu", "Kỷ", "Canh", "Tân", "Nhâm", "Quý"];
export const CHI = ["Tý", "Sửu", "Dần", "Mão", "Thìn", "Tỵ", "Ngọ", "Mùi", "Thân", "Dậu", "Tuất", "Hợi"];
export const GIO_HD = ["110100101100", "001101001011", "110011010010", "101100110100", "001011001101", "010010110011"];

export function getYearCanChi(year) {
	return CAN[(year + 6) % 10] + ' ' + CHI[(year + 8) % 12];
}

export function getCanHour0(jdn) {
	return CAN[((jdn - 1) * 2) % 10];
}

export function getGioHoangDao(jd) {
	var chiOfDay = (jd + 1) % 12;
	var gioHD = GIO_HD[chiOfDay % 6];
	var ret = [];
	for (var i = 0; i < 12; i++) {
		if (gioHD.charAt(i) == '1') {
			const startHour = (i * 2 + 23) % 24;
			const endHour = (i * 2 + 1) % 24;
			ret.push({
				chiName: CHI[i],
				range: `${startHour}:00 - ${endHour}:00`
			});
		}
	}
	return ret;
}

export function isHoangDaoDay(lLunarMonth, dayChiIndex) {
	const lMonthNormalized = (lLunarMonth - 1) % 6;
	const hoangDaoMatrix = [
		[0, 1, 5, 7],      // Tháng 1, 7: Tý, Sửu, Tị, Mùi
		[2, 3, 7, 9],      // Tháng 2, 8: Dần, Mão, Mùi, Dậu
		[4, 5, 9, 11],     // Tháng 3, 9: Thìn, Tị, Dậu, Hợi
		[6, 7, 1, 9],      // Tháng 4, 10: Ngọ, Mùi, Sửu, Dậu
		[1, 3, 8, 9],      // Tháng 5, 11: Sửu, Mão, Thân, Dậu
		[3, 5, 10, 11]     // Tháng 6, 12: Mão, Tị, Tuất, Hợi
	];
	return hoangDaoMatrix[lMonthNormalized].includes(dayChiIndex);
}

export function isHacDaoDay(lLunarMonth, dayChiIndex) {
	const lMonthNormalized = (lLunarMonth - 1) % 6;
	const hacDaoMatrix = [
		[6, 3, 11, 9],     // Tháng 1, 7: Ngọ, Mão, Hợi, Dậu
		[8, 5, 1, 11],     // Tháng 2, 8: Thân, Tị, Sửu, Hợi
		[10, 7, 3, 1],     // Tháng 3, 9: Dậu, Mùi, Mão, Sửu
		[0, 9, 5, 3],      // Tháng 4, 10: Tý, Dậu, Tị, Mão
		[2, 11, 7, 5],     // Tháng 5, 11: Dần, Hợi, Mùi, Tị
		[4, 1, 9, 7]       // Tháng 6, 12: Thìn, Sửu, Dậu, Mùi
	];
	return hacDaoMatrix[lMonthNormalized].includes(dayChiIndex);
}
