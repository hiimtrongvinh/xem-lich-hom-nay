import { convertLunar2Solar, jdFromDate } from './lunar.js';

// Solar holidays list
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
	'Tết Dương Lịch': 'Thời khắc mở đầu cho một năm mới tràn đầy hy vọng và những khởi đầu mới. Đây là dịp để mọi người trên khắp thế giới sum họp bên gia đình, nhìn lại chặng đường đã qua và cùng nhau đặt ra những mục tiêu bứt phá cho tương lai.',
	'Lễ Tình nhân (Valentine)': 'Ngày hội ngọt ngào tôn vinh tình yêu đôi lứa trên toàn thế giới. Đây là cơ hội tuyệt vời để bày tỏ tình cảm chân thành với nửa kia bằng những đóa hoa hồng rực rỡ, thanh chocolate ngọt ngào hay những lời yêu thương lãng mạn.',
	'Ngày Quốc tế Phụ nữ': 'Dịp ý nghĩa để cả xã hội bày tỏ lòng tri ân và tôn vinh vẻ đẹp, sự hy sinh cùng những cống hiến thầm lặng của một nửa thế giới. Ngày này nhắc nhở chúng ta luôn trân trọng, yêu thương người phụ nữ bên cạnh mình.',
	'Ngày Thành lập Đoàn Thanh niên Cộng sản Hồ Chí Minh': 'Ngày hội của thanh xuân, nhiệt huyết và khát khao cống hiến. Đây là dịp tôn vinh tinh thần xung kích, sáng tạo của thế hệ trẻ Việt Nam trong sự nghiệp xây dựng và bảo vệ Tổ quốc.',
	'Ngày Giải phóng miền Nam, thống nhất đất nước': 'Cột mốc vàng chói lọi trong lịch sử dân tộc, đánh dấu ngày non sông chính thức nối liền một dải, mở ra kỷ nguyên độc lập, tự do cho đất nước. Đây là lúc thế hệ sau nghiêng mình tưởng nhớ công lao vĩ đại của cha ông.',
	'Ngày Quốc tế Lao động': 'Ngày hội biểu dương tinh thần đoàn kết và sức mạnh sáng tạo của lực lượng lao động toàn cầu. Đây là dịp khẳng định tầm quan trọng của người lao động trong việc kiến tạo, thúc đẩy sự phát triển thịnh vượng của xã hội.',
	'Chiến Thắng Điện Biên Phủ': 'Mốc son chói lọi ghi dấu một chiến thắng lừng lẫy năm châu, chấn động địa cầu. Ngày này khơi dậy niềm tự hào dân tộc sâu sắc về tinh thần yêu nước, ý chí tự lực tự cường vững chắc của quân và dân ta.',
	'Ngày sinh Chủ Tịch Hồ Chí Minh': 'Thời khắc thiêng liêng để mỗi người dân đất Việt hướng về Lãnh tụ kính yêu của dân tộc. Cuộc đời và sự nghiệp vĩ đại của Người luôn là tấm gương sáng ngời, truyền cảm hứng mạnh mẽ cho các thế hệ mai sau.',
	'Ngày Quốc tế Thiếu nhi': 'Ngày hội tràn đầy tiếng cười của trẻ thơ trên khắp hành tinh. Đây cũng là dịp để gia đình, nhà trường và xã hội cùng nhìn lại, nâng cao trách nhiệm trong việc bảo vệ, chăm sóc và giáo dục mầm non tương lai.',
	'Ngày Thương binh Liệt sĩ': 'Ngày tri ân thấm đượm đạo lý "Uống nước nhớ nguồn" cao đẹp của dân tộc. Cả nước cùng trang nghiêm tưởng nhớ, bày tỏ lòng biết ơn vô hạn đối với các anh hùng thương binh, liệt sĩ đã hiến dâng xương máu vì nền độc lập tự do của Tổ quốc.',
	'Cách mạng Tháng Tám Thành Công': 'Sự kiện lịch sử vĩ đại đánh dấu thắng lợi oanh liệt của cuộc tổng khởi nghĩa giành lại độc lập, chủ quyền cho dân tộc. Trang sử hào hùng này đã mở ra một kỷ nguyên mới, kỷ nguyên tự do và tự chủ của người Việt.',
	'Ngày Quốc khánh nước Cộng hòa Xã hội Chủ nghĩa Việt Nam': 'Ngày Tết Độc Lập thiêng liêng của toàn dân tộc Việt Nam, kỷ niệm thời khắc Chủ tịch Hồ Chí Minh đọc bản Tuyên ngôn Độc lập tại Quảng trường Ba Đình lịch sử, khai sinh ra nước Việt Nam Dân chủ Cộng hòa.',
	'Ngày Giải phóng Thủ Đô': 'Ngày lịch sử rợp bóng cờ hoa chào đón đoàn quân chiến thắng trở về tiếp quản thủ đô. Cột mốc ý nghĩa này mở ra thời kỳ kiến thiết, phát triển yên bình và rực rỡ của mảnh đất Hà Thành nghìn năm văn hiến.',
	'Ngày Phụ nữ Việt Nam': 'Dịp đặc biệt để tôn vinh những giá trị truyền thống cao đẹp của người phụ nữ Việt: kiên cường, đảm đang, nhân hậu. Họ chính là hậu phương vững chắc và là những người giữ lửa ấm áp cho mọi nếp nhà.',
	'Ngày Nhà giáo Việt Nam': 'Ngày hội tri ân sâu sắc truyền thống "Tôn sư trọng đạo" tốt đẹp của dân tộc. Đây là cơ hội để các thế hệ học trò gửi gắm tấm lòng biết ơn, sự kính trọng chân thành đến những "người lái đò" thầm lặng đưa tri thức qua sông.',
	'Ngày Thành lập Quân đội Nhân dân Việt Nam': 'Ngày tôn vinh hình tượng cao đẹp của anh bộ đội cụ Hồ và truyền thống bách chiến bách thắng của quân đội ta. Đây cũng là ngày hội Quốc phòng toàn dân, khơi dậy lòng yêu nước và ý thức bảo vệ chủ quyền biên cương.',
	'Lễ Giáng Sinh (Noel)': 'Lễ hội mang không khí ấm áp, an lành lan tỏa khắp mọi nếp nhà. Đây là thời khắc diệu kỳ để mọi người trao đi yêu thương, chia sẻ những món quà ý nghĩa và nguyện cầu một mùa đông yên bình, hạnh phúc.',
	'Giao thừa': 'Khoảnh khắc thiêng liêng chuyển giao giữa năm cũ và năm mới, xua tan đi những lo toan để chào đón vận hội mới. Cả gia đình quây quần ấm cúng bên mâm cơm tất niên, cùng gửi gắm những ước vọng may mắn, cát tường.',
	'Mùng 1 Tết Nguyên đán': 'Ngày khởi đầu của năm mới âm lịch, mang đậm nét đẹp văn hóa gia đình phương Đông. Theo phong tục "Mùng 1 Tết cha", đây là thời gian con cháu tề tựu, dâng lời chúc thọ và hiếu kính lên ông bà, cha mẹ bên nội.',
	'Mùng 2 Tết Nguyên đán': 'Không khí đón xuân tiếp tục rộn ràng trong ngày mùng 2. Gắn liền với tục lệ "Mùng 2 Tết mẹ", cả gia đình cùng hướng về bên ngoại, vun đắp tình thân ấm áp và gửi những lời chúc đầu năm an lành tới họ hàng, người thân.',
	'Mùng 3 Tết Nguyên đán': 'Ngày mùng 3 hướng về thầy cô kính yêu với tinh thần hiếu học truyền thống "Mùng 3 Tết thầy". Đây là dịp để các thế hệ học trò tụ họp, bày tỏ tấm lòng biết ơn sâu sắc đến những người đã tận tụy dìu dắt mình trên con đường tri thức.',
	'Tết Nguyên tiêu (Rằm Tháng Giêng)': 'Ngày rằm đầu tiên của năm mới, mang ý nghĩa cầu mong một năm vạn sự hanh thông, cát tường. Với quan niệm "Cúng quanh năm không bằng Rằm tháng Giêng", mọi người thường sắm sửa mâm cúng chu toàn, đi lễ chùa phóng sinh tích đức.',
	'Giỗ Tổ Hùng Vương': 'Ngày Quốc giỗ thiêng liêng triệu trái tim con hồng cháu lạc cùng hướng về nguồn cội. Tinh thần đoàn kết, biết ơn công lao dựng nước của các vua Hùng luôn là cội nguồn sức mạnh giúp dân tộc ta gìn giữ bền vững giang sơn.',
	'Lễ Phật Đản (15/4)': 'Đại lễ vô cùng trọng đại của tín đồ Phật giáo khắp thế giới, hướng tâm con người đến các giá trị từ bi hỷ xả, thiện lương. Ngày này nhắc nhở chúng ta sống tốt đời đẹp đạo, cùng cầu nguyện cho nhân loại bình an, vạn sinh cát tường.',
	'Tết Đoan Ngọ (5/5)': 'Ngày Tết giết sâu bọ độc đáo trong phong tục cổ truyền của người Việt. Mọi người thường ăn rượu nếp, hoa quả chua vào sáng sớm để thanh lọc cơ thể, cầu mong sức khỏe dồi dào, tránh xa bệnh tật và mùa màng thuận lợi.',
	'Lễ Vu Lan (Rằm Tháng Bảy)': 'Mùa Vu Lan báo hiếu - một nét đẹp nhân văn sâu sắc của văn hóa truyền thống. Đây là thời điểm lắng đọng để mỗi người thể hiện lòng hiếu thảo, tri ân công ơn sinh thành dưỡng dục của cha mẹ và tổ tiên.',
	'Tết Trung Thu (Rằm Tháng Tám)': 'Ngày Tết đoàn viên rộn rã tiếng cười của mọi gia đình, đặc biệt là các em nhỏ. Dưới ánh trăng rằm sáng tỏ, trẻ em náo nức rước đèn phá cỗ, người lớn quây quần thưởng trà bánh, tận hưởng khoảnh khắc sum họp ấm cúng.',
	'Ngày Ông Táo chầu trời': 'Nét đẹp văn hóa tâm linh khép lại một năm bận rộn. Gia chủ sắm sửa lễ mâm cúng, thả cá chép phóng sinh để tiễn đưa các vị Táo quân về chầu trời, báo cáo mọi việc lớn nhỏ trong nhà lên Ngọc Hoàng.'
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
