import { convertLunar2Solar, jdFromDate } from './lunar.js';

// Solar holidays list
export const solarHolidays = [
	{ day: 1, month: 1, name: 'Tết Dương Lịch' },
	{ day: 14, month: 2, name: 'Lễ Tình nhân (Valentine)' },
	{ day: 8, month: 3, name: 'Ngày Quốc tế Phụ nữ' },
	{ day: 26, month: 3, name: 'Ngày Thành lập Đoàn Thanh niên Cộng sản Hồ Chí Minh' },
	{ day: 30, month: 4, name: 'Ngày Giải phóng miền Nam, thống nhất đất nước' },
	{ day: 1, month: 5, name: 'Ngày Quốc tế Lao động' },
	{ day: 7, month: 5, name: 'Chiến Thắng Điện Biên Phủ' },
	{ day: 19, month: 5, name: 'Ngày sinh Chủ Tịch Hồ Chí Minh' },
	{ day: 1, month: 6, name: 'Ngày Quốc tế Thiếu nhi' },
	{ day: 27, month: 7, name: 'Ngày Thương binh Liệt sĩ' },
	{ day: 19, month: 8, name: 'Cách mạng Tháng Tám Thành Công' },
	{ day: 2, month: 9, name: 'Ngày Quốc khánh nước Cộng hòa Xã hội Chủ nghĩa Việt Nam' },
	{ day: 10, month: 10, name: 'Ngày Giải phóng Thủ Đô' },
	{ day: 20, month: 10, name: 'Ngày Phụ nữ Việt Nam' },
	{ day: 20, month: 11, name: 'Ngày Nhà giáo Việt Nam' },
	{ day: 22, month: 12, name: 'Ngày Thành lập Quân đội Nhân dân Việt Nam' },
	{ day: 25, month: 12, name: 'Lễ Giáng Sinh (Noel)' }
];

// Lunar holidays list
export const lunarHolidays = [
	{ day: 1, month: 1, name: 'Mùng 1 Tết Nguyên đán' },
	{ day: 2, month: 1, name: 'Mùng 2 Tết Nguyên đán' },
	{ day: 3, month: 1, name: 'Mùng 3 Tết Nguyên đán' },
	{ day: 15, month: 1, name: 'Tết Nguyên tiêu (Rằm Tháng Giêng)' },
	{ day: 10, month: 3, name: 'Giỗ Tổ Hùng Vương' },
	{ day: 15, month: 4, name: 'Lễ Phật Đản (15/4)' },
	{ day: 5, month: 5, name: 'Tết Đoan Ngọ (5/5)' },
	{ day: 15, month: 7, name: 'Lễ Vu Lan (Rằm Tháng Bảy)' },
	{ day: 15, month: 8, name: 'Tết Trung Thu (Rằm Tháng Tám)' },
	{ day: 23, month: 12, name: 'Ngày Ông Táo chầu trời' }
];

export const HOLIDAY_PARAGRAPHS = {
	'Tết Dương Lịch': 'Tết Dương Lịch mở đầu cho một năm mới dương lịch tràn đầy hy vọng. Đây là thời khắc mọi người trên thế giới cùng nhau chúc mừng, sum họp gia đình và đề ra những mục tiêu mới cho chặng đường tiếp theo.',
	'Lễ Tình nhân (Valentine)': 'Lễ Tình nhân (Valentine) là ngày tôn vinh tình yêu đôi lứa. Đây là dịp ngọt ngào để những người yêu nhau thể hiện tình cảm, trao nhau những lời chúc chân thành, đóa hoa hồng hay thanh chocolate ý nghĩa.',
	'Ngày Quốc tế Phụ nữ': 'Ngày Quốc tế Phụ nữ 8/3 là dịp tôn vinh và gửi lời tri ân sâu sắc đến một nửa thế giới. Ngày này nhắc nhở chúng ta trân trọng vai trò, đóng góp và những cống hiến thầm lặng của người Phụ nữ trong gia đình và xã hội.',
	'Ngày Thành lập Đoàn Thanh niên Cộng sản Hồ Chí Minh': 'Ngày Thành lập Đoàn Thanh niên Cộng sản Hồ Chí Minh 26/3 tôn vinh sức trẻ, nhiệt huyết và khát vọng cống hiến của thế hệ trẻ Việt Nam, thúc đẩy tinh thần xung kích vì sự phát triển đất nước.',
	'Ngày Giải phóng miền Nam, thống nhất đất nước': 'Ngày Giải phóng miền Nam, thống nhất đất nước 30/4 là mốc son chói lọi trong lịch sử dân tộc Việt Nam, ngày non sông thu về một mối, đất nước thống nhất. Đây là dịp để tưởng nhớ công ơn của cha ông đã hy sinh vì nền độc lập tự do.',
	'Ngày Quốc tế Lao động': 'Ngày Quốc tế Lao động 1/5 biểu dương và tôn vinh lực lượng lao động toàn thế giới, ngày của sự đoàn kết và quyền lợi của người lao động trong việc xây dựng và phát triển xã hội.',
	'Chiến Thắng Điện Biên Phủ': 'Chiến Thắng Điện Biên Phủ 7/5 là chiến thắng lừng lẫy năm châu, chấn động địa cầu, niềm tự hào sâu sắc của quân và dân ta trong cuộc kháng chiến chống thực dân Pháp cứu nước.',
	'Ngày sinh Chủ Tịch Hồ Chí Minh': 'Ngày sinh Chủ Tịch Hồ Chí Minh 19/5 là dịp cả nước bày tỏ lòng biết ơn vô hạn đối với vị Lãnh tụ kính yêu của dân tộc Việt Nam, người đã hiến dâng cả cuộc đời mình cho sự nghiệp Giải phóng đất nước.',
	'Ngày Quốc tế Thiếu nhi': 'Ngày Quốc tế Thiếu nhi 1/6 dành trọn tình yêu thương cho trẻ em. Đây là ngày nhắc nhở gia đình và toàn xã hội về việc chăm sóc, bảo vệ và giáo dục mầm non tương lai của đất nước.',
	'Ngày Thương binh Liệt sĩ': 'Ngày Thương binh Liệt sĩ 27/7 thể hiện đạo lý "Uống nước nhớ nguồn" cao đẹp của người Việt, dịp tri ân sâu sắc các anh hùng thương binh, liệt sĩ đã cống hiến xương máu cho Tổ quốc.',
	'Cách mạng Tháng Tám Thành Công': 'Ngày kỷ niệm Cách mạng Tháng Tám Thành Công 19/8 đánh dấu cuộc tổng khởi nghĩa oanh liệt của nhân dân ta giành lại chính quyền, mở ra một trang sử mới chói lọi cho dân tộc.',
	'Ngày Quốc khánh nước Cộng hòa Xã hội Chủ nghĩa Việt Nam': 'Ngày Quốc khánh nước Cộng hòa Xã hội Chủ nghĩa Việt Nam 2/9 kỷ niệm thời khắc Chủ tịch Hồ Chí Minh đọc bản Tuyên ngôn Độc lập tại quảng trường Ba Đình, khai sinh ra nước Việt Nam Dân chủ Cộng hòa.',
	'Ngày Giải phóng Thủ Đô': 'Ngày Giải phóng Thủ Đô 10/10 đánh dấu cột mốc quân ta tiến về tiếp quản Hà Nội trong niềm hân hoan rợp cờ hoa, mở ra thời kỳ phát triển tự do, yên bình của thủ đô thân yêu.',
	'Ngày Phụ nữ Việt Nam': 'Ngày Phụ nữ Việt Nam 20/10 nhằm tôn vinh những người mẹ, người chị, người em gái Việt Nam kiên cường, đảm đang, nhân hậu, luôn hy sinh và đóng góp to lớn cho sự nghiệp dựng xây đất nước.',
	'Ngày Nhà giáo Việt Nam': 'Ngày Nhà giáo Việt Nam 20/11 là ngày hội hiến chương các Nhà giáo, dịp để các thế hệ học trò thể hiện lòng kính trọng và tri ân sâu sắc tinh thần tôn sư trọng đạo đến người thầy, người cô kính yêu.',
	'Ngày Thành lập Quân đội Nhân dân Việt Nam': 'Ngày Thành lập Quân Đội Nhân Dân Việt Nam 22/12 tôn vinh truyền thống anh dũng của quân đội ta và ngày hội Quốc phòng toàn dân, bảo vệ vững chắc biên cương Tổ quốc.',
	'Lễ Giáng Sinh (Noel)': 'Lễ Giáng Sinh (Noel) mang không khí ấm áp, an lành đến mọi nhà trên thế giới. Đây là ngày mọi người trao nhau tình yêu thương, những món quà ý nghĩa và lời chúc bình an hạnh phúc.',
	'Giao thừa': 'Đêm Giao Thừa thiêng liêng xua tan đi những muộn phiền của năm cũ để đón chào năm mới. Đây là thời khắc chuyển giao đất trời, cả gia đình quây quản ấm cúng bên mâm cơm tất niên và làm lễ cúng tiễn đưa cựu tuế.',
	'Mùng 1 Tết Nguyên đán': 'Mùng 1 Tết Nguyên đán mở đầu cho năm mới âm lịch. Theo phong tục cổ truyền "Mùng 1 Tết cha", đây là ngày gia đình con cháu quây quần chúc Tết bên nội, tỏ lòng hiếu thảo kính trọng đấng sinh thành và cầu mong một năm bình an cát tường.',
	'Mùng 2 Tết Nguyên đán': 'Mùng 2 Tết Nguyên đán nối tiếp niềm vui đầu năm. Theo tục lệ "Mùng 2 Tết mẹ", đây là dịp cả gia đình hướng về bên ngoại, sum họp chúc Tết họ hàng bên mẹ trong bầu không khí ấm áp, vui tươi gắn kết tình thân.',
	'Mùng 3 Tết Nguyên đán': 'Mùng 3 Tết Nguyên đán gắn liền với truyền thống hiếu học tôn sư trọng đạo "Mùng 3 Tết thầy". Đây là ngày để các thế hệ học trò đến chúc Tết và bày tỏ lòng biết ơn sâu sắc đến người thầy, người cô đã truyền dạy tri thức cho mình.',
	'Tết Nguyên tiêu (Rằm Tháng Giêng)': 'Tết Nguyên Tiêu (Rằm Tháng Giêng) là ngày rằm đầu tiên của năm mới, mang ý nghĩa cầu mong may mắn cát tường tràn đầy. Mọi người thường đi lễ chùa, phóng sinh và chuẩn bị mâm cúng chu toàn với quan niệm "Cúng quanh năm không bằng Rằm tháng Giêng".',
	'Giỗ Tổ Hùng Vương': 'Ngày Giỗ Tổ Hùng Vương mùng 10 tháng 3 âm lịch là quốc giỗ của dân tộc Việt Nam để tưởng nhớ công lao dựng nước của các vua Hùng. Tinh thần hướng về nguồn cội nhắc nhở con cháu Lạc Hồng gìn giữ non sông gấm vóc.',
	'Lễ Phật Đản (15/4)': 'Lễ Phật Đản rằm tháng Tư âm lịch kỷ niệm ngày Đức Phật Thích Ca Mâu Ni đản sinh. Đây là ngày lễ trọng đại của Phật giáo hướng con người tới tâm thiện lành, từ bi hỷ xả, cầu mong thế giới hòa bình, vạn sinh an lạc.',
	'Tết Đoan Ngọ (5/5)': 'Tết Đoan Ngọ mùng 5 tháng 5 âm lịch, hay còn gọi là Tết diệt sâu bọ. Theo phong tục, mọi người thường ăn rượu nếp, quả chua vào sáng sớm để xua đuổi bệnh tật, cầu mong sức khỏe dồi dào và mùa màng tươi tốt.',
	'Lễ Vu Lan (Rằm Tháng Bảy)': 'Lễ Vu Lan báo hiếu rằm tháng Bảy âm lịch là dịp tôn vinh lòng hiếu thảo kính yêu cha mẹ, tưởng nhớ tổ tiên và làm việc thiện tích đức cầu siêu cho vong linh, thể hiện tính nhân văn sâu sắc của đạo lý dân tộc.',
	'Tết Trung Thu (Rằm Tháng Tám)': 'Tết Trung Thu rằm tháng Tám âm lịch là Tết đoàn viên dành cho mọi nhà, đặc biệt là các em Thiếu nhi. Trẻ em rước đèn phá cỗ dưới ánh trăng rằm sáng trong, cả gia đình sum họp thưởng trà ăn bánh trung thu ấm cúng.',
	'Ngày Ông Táo chầu trời': 'Ngày mùng 23 tháng Chạp là ngày tiễn đưa Ông Công Ông Táo chầu trời để báo cáo mọi việc lớn nhỏ trong nhà của gia chủ suốt năm qua lên Ngọc Hoàng. Phong tục thả cá chép phóng sinh mang ý nghĩa tiễn Táo quân về trời bình an.'
};

export function getDaysInLunarMonth12(lunarYear) {
	const solarNextYearJan1 = convertLunar2Solar(1, 1, lunarYear + 1, 0);
	const jdNextYearJan1 = jdFromDate(solarNextYearJan1[0], solarNextYearJan1[1], solarNextYearJan1[2]);

	const solarDec1 = convertLunar2Solar(1, 12, lunarYear, 0);
	const jdDec1 = jdFromDate(solarDec1[0], solarDec1[1], solarDec1[2]);

	return jdNextYearJan1 - jdDec1;
}

export function getHoliday(solarDay, solarMonth, lunarDay, lunarMonth, isLeap, lunarYear) {
	const list = [];
	const sH = solarHolidays.find(h => h.day === solarDay && h.month === solarMonth);
	if (sH) list.push(sH.name);
	if (!isLeap) {
		if (lunarMonth === 12) {
			const daysInDec = getDaysInLunarMonth12(lunarYear);
			if ((daysInDec === 29 && lunarDay === 29) || (daysInDec === 30 && lunarDay === 30)) {
				list.push('Giao thừa');
			}
		}

		const lH = lunarHolidays.find(h => h.day === lunarDay && h.month === lunarMonth);
		if (lH) list.push(lH.name);
	}
	return list.length > 0 ? list.join(' / ') : null;
}
