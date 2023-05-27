import { Types } from "mongoose";
import { IS_PRODUCTION } from "../config";

export function CONTEST_CONFIRMATION_EMAIL(
    receiver: string,
    teamName: string,
    confirmationCode: string
) {
    return `
    <div dir="ltr">
	<div
		style="
			background-color: #f6f7f9;
			margin: 0;
			padding: 0;
			font-family: 'Open Sans', Arial, sans-serif !important;
			font-weight: 400;
			color: #202124;
		">
		<div></div>
		<table cellpadding="15" cellspacing="0" border="0" width="100%">
			<tbody>
				<tr>
					<td style="background-color: #f6f7f9" align="center" width="100%">
						<table
							style="
								border-bottom-left-radius: 4px;
								border-bottom-right-radius: 4px;
								overflow: hidden;
								min-width: 290px;
								max-width: 600px;
							"
							cellspacing="0"
							cellpadding="0"
							border="0">
							<tbody>
								<tr>
									<td>
										<table
											cellspacing="0"
											cellpadding="0"
											border="0"
											width="100%">
											<tbody>
												<tr>
													<td
														style="
															padding: 0 0 15px;
															font-family: 'Open Sans', Arial, sans-serif !important;
														"
														valign="middle">
														<a
															style="
																font-size: 12px;
																color: #6f6f6f !important;
																padding: 1px 0;
																text-decoration: none !important;
															"
															href="https://streaklinks.com/BT8hHi6i4sz87Zu_jgWlHBim/https%3A%2F%2Fu16161593.ct.sendgrid.net%2Fls%2Fclick%3Fupn%3D6FylDzOsBjandYrle4FqVZSdv3-2BbZ0ATs1aFPrX0LwznXXv5-2BoPgUHFt4ZMWenhtzqm7TjwMiA-2FFAAcTgMmUzqjVEhGztoc3RXmIWr31f9U-3DI0CU_J2sXdVe2BnhqC3exzESXAmJMuMzjG71v7RSUsMbKve6Ib29LkCTGRRHZ0UZx9utc0IXBPSuXDsulPt-2BMuYAqYyOAd83zZixxdWawNN-2BT-2BiEAS7-2Bs49aOD3vNf7i12oczTvTKAg7vnxumi6yz7-2BrLhBQeoo95o72ChUsisLrcxpHCbTdj3-2Fpf0KoNR-2B9tXM6uj3lrwEddbE5MTql81MA0wQ-3D-3D"
															target="_blank"
															data-saferedirecturl="https://www.google.com/url?q=https://streaklinks.com/BT8hHi6i4sz87Zu_jgWlHBim/https%253A%252F%252Fu16161593.ct.sendgrid.net%252Fls%252Fclick%253Fupn%253D6FylDzOsBjandYrle4FqVZSdv3-2BbZ0ATs1aFPrX0LwznXXv5-2BoPgUHFt4ZMWenhtzqm7TjwMiA-2FFAAcTgMmUzqjVEhGztoc3RXmIWr31f9U-3DI0CU_J2sXdVe2BnhqC3exzESXAmJMuMzjG71v7RSUsMbKve6Ib29LkCTGRRHZ0UZx9utc0IXBPSuXDsulPt-2BMuYAqYyOAd83zZixxdWawNN-2BT-2BiEAS7-2Bs49aOD3vNf7i12oczTvTKAg7vnxumi6yz7-2BrLhBQeoo95o72ChUsisLrcxpHCbTdj3-2Fpf0KoNR-2B9tXM6uj3lrwEddbE5MTql81MA0wQ-3D-3D&amp;source=gmail&amp;ust=1684900982510000&amp;usg=AOvVaw2hcgQx-yyLguam3pt8qVxw">
															Google Developer Student Clubs - VNU HCM -
															University of Technology
														</a>
													</td>

													<td
														style="
															padding: 0 0 15px;
															font-family: 'Open Sans', Arial, sans-serif !important;
														"
														valign="middle"
														align="right">
														<br />
													</td>
												</tr>
											</tbody>
										</table>
									</td>
								</tr>

								<tr>
									<td
										style="
											width: 600px;
											height: 136px;
											vertical-align: middle;
											border-bottom: 0px solid #f6f7f9;
											background-image: url(https://ci3.googleusercontent.com/proxy/jTbSl0_Srn4p-vihHLXnamvPIRqeZxUV8BUKAc3K9e9SGOUfkrvcSD4lXc-hrT8Xy6TJTpGAoO1_1YQhcYJhuyEUTFyhmZKHILgw709SiBMN2jTydWgf-PLxJc7UJrg8BTjB7aVfi1k1LjsoJov1dIrrxeNjzDGWSWctWk0mu2U2Ob7UM1QWU8BrNTkvaA8PdcQqyhXjlHU-J7n3k5vcCTHI6QZno8Eei93sXQGLfNiw_9nWGxWmgA=s0-d-e1-ft#https://res.cloudinary.com/startup-grind/image/upload/c_fill,dpr_2.0,f_auto,g_center,h_135,q_auto:eco,w_600/v1/gcs/platform-data-dsc/contentbuilder/email_header.png);
											background-color: #fff;
											border-top-right-radius: 4px;
											border-top-left-radius: 4px;
											background-size: cover;
										">
										<table
											style="width: 100%"
											width="100%"
											cellspacing="20"
											cellpadding="0"
											border="0">
											<tbody>
												<tr>
													<td
														style="vertical-align: middle; text-align: center">
														<div style="display: inline-block">
															<a
																style="text-align: center; display: block"
																href="https://streaklinks.com/BT8hHi6PT1YYETjglwM_Hm9E/https%3A%2F%2Fu16161593.ct.sendgrid.net%2Fls%2Fclick%3Fupn%3D6FylDzOsBjandYrle4FqVZSdv3-2BbZ0ATs1aFPrX0LwznXXv5-2BoPgUHFt4ZMWenhtzqm7TjwMiA-2FFAAcTgMmUzqjVEhGztoc3RXmIWr31f9U-3D1WWW_J2sXdVe2BnhqC3exzESXAmJMuMzjG71v7RSUsMbKve6Ib29LkCTGRRHZ0UZx9utcOdQF6JS3ei-2Fi-2B544Dvf86oqppqJ8ierQQhGgjkxucq7fumdIZnstg-2BFUndpO-2FfxP4Ly3TP4GzCOy9ht90I8WESMt6kPH7KOOCcKJJqWM79bCah4CxTulb6AN7wK5cJ2S-2FdFuFhMq1xCBL1vObinRiQ-3D-3D"
																target="_blank"
																data-saferedirecturl="https://www.google.com/url?q=https://streaklinks.com/BT8hHi6PT1YYETjglwM_Hm9E/https%253A%252F%252Fu16161593.ct.sendgrid.net%252Fls%252Fclick%253Fupn%253D6FylDzOsBjandYrle4FqVZSdv3-2BbZ0ATs1aFPrX0LwznXXv5-2BoPgUHFt4ZMWenhtzqm7TjwMiA-2FFAAcTgMmUzqjVEhGztoc3RXmIWr31f9U-3D1WWW_J2sXdVe2BnhqC3exzESXAmJMuMzjG71v7RSUsMbKve6Ib29LkCTGRRHZ0UZx9utcOdQF6JS3ei-2Fi-2B544Dvf86oqppqJ8ierQQhGgjkxucq7fumdIZnstg-2BFUndpO-2FfxP4Ly3TP4GzCOy9ht90I8WESMt6kPH7KOOCcKJJqWM79bCah4CxTulb6AN7wK5cJ2S-2FdFuFhMq1xCBL1vObinRiQ-3D-3D&amp;source=gmail&amp;ust=1684900982510000&amp;usg=AOvVaw3gBg_MMpNAgWKpAVsRMA0Y">
																<img
																	height="50"
																	border="0"
																	alt="Google Developer Student Clubs"
																	src="https://ci3.googleusercontent.com/proxy/wEsj66QGvdQacrMw4Qm3A1r-Gbyd3Uz7XY2HRkhxyXCxKpzCzuqi2KlBu70FVmRXCvpd7HqgnKJFFW2ga4xiGnLgF1jjWDvQfTAgMBbC_onFujTrhFAl99zrDBLsS6moSRMG2EAHgFGRL2dLMbG-0GkgcVd3pOEeeTJzZzhI6CuspG6FeRi177hNC7sRe2INLGkoVoVMrgzZhPiZs4HnGot13yae4p1VnyKpydIqCwul8OV7wDdlCBT8EQ9K6HTlNVMM49A=s0-d-e1-ft#https://res.cloudinary.com/startup-grind/image/upload/c_fit,dpr_2.0,f_auto,g_center,h_100,q_auto:good,w_500/v1/gcs/platform-data-dsc/contentbuilder/logo_dark_stacked_ziDh4mP.png" />
															</a>
														</div>
													</td>
												</tr>
											</tbody>
										</table>
									</td>
								</tr>

								<tr>
									<td style="padding-top: 1px">
										<table
											cellspacing="0"
											cellpadding="0"
											border="0"
											width="100%">
											<tbody>
												<tr>
													<td
														style="
															background-color: #fff;
															padding: 25px 35px;
															text-align: left;
															font-family: 'Open Sans', Arial, sans-serif !important;
															font-size: 14px;
															line-height: 20px;
														"
														align="center"
														valign="top">
														<span
															id="m_4733994766360779959m_7286841442065195665m_-7246610426249120709gmail-docs-internal-guid-1795923a-7fff-3ee5-47f8-07a4555c096e"
															><p
																dir="ltr"
																style="
																	line-height: 1.656;
																	background-color: rgb(255, 255, 255);
																	margin-top: 0pt;
																	margin-bottom: 0pt;
																	padding: 0pt 0pt 10pt;
																">
																<span
																	style="
																		font-variant-numeric: normal;
																		font-variant-east-asian: normal;
																		font-variant-alternates: normal;
																		font-size: 12pt;
																		font-family: Arial;
																		color: rgb(0, 0, 0);
																		background-color: transparent;
																	"
																	>Xin chào </span
																><span
																	style="
																		font-variant-numeric: normal;
																		font-variant-east-asian: normal;
																		font-variant-alternates: normal;
																		font-size: 12pt;
																		font-family: Arial;
																		color: rgb(0, 0, 0);
																		background-color: transparent;
																		font-weight: 700;
																	"
																	>${receiver}</span
																><span
																	style="
																		font-variant-numeric: normal;
																		font-variant-east-asian: normal;
																		font-variant-alternates: normal;
																		font-size: 12pt;
																		font-family: Arial;
																		color: rgb(0, 0, 0);
																		background-color: transparent;
																	"
																	>,</span
																><br />
															</p>
															<p
																dir="ltr"
																style="
																	line-height: 1.872;
																	background-color: rgb(255, 255, 255);
																	margin-top: 0pt;
																	margin-bottom: 0pt;
																	padding: 0pt 0pt 10pt;
																">
																<span
																	style="
																		font-size: 12pt;
																		font-family: Arial;
																		color: rgb(0, 0, 0);
																		background-color: transparent;
																		font-weight: 400;
																		font-style: normal;
																		font-variant: normal;
																		text-decoration: none;
																	"
																	>Chúc mừng đội </span
																><span
																	style="
																		font-size: 12pt;
																		font-family: Arial;
																		color: rgb(0, 0, 0);
																		background-color: transparent;
																		font-weight: 700;
																		font-style: normal;
																		font-variant: normal;
																		text-decoration: none;
																	"
																	>${teamName}</span
																><span
																	style="
																		font-size: 12pt;
																		font-family: Arial;
																		color: rgb(0, 0, 0);
																		background-color: transparent;
																		font-weight: 400;
																		font-style: normal;
																		font-variant: normal;
																		text-decoration: none;
																	">
																	đã đăng ký thành công và trở thành một phần
																	của cuộc thi GDSC Idea Contest: THiNK
																	2023.&nbsp;</span
																>
															</p>
															<p
																dir="ltr"
																style="
																	line-height: 1.872;
																	background-color: rgb(255, 255, 255);
																	margin-top: 0pt;
																	margin-bottom: 0pt;
																	padding: 0pt 0pt 10pt;
																">
																<span
																	style="
																		font-size: 12pt;
																		font-family: Arial;
																		color: rgb(0, 0, 0);
																		background-color: transparent;
																		font-weight: 400;
																		font-style: normal;
																		font-variant: normal;
																		text-decoration: none;
																	"
																	>Thông tin của các đội thi sẽ được cập nhật ở
																	website cuộc thi </span
																><span
																	style="
																		font-size: 12pt;
																		font-family: Arial;
																		color: rgb(0, 0, 0);
																		background-color: transparent;
																		font-weight: 700;
																		font-style: normal;
																		font-variant: normal;
																		text-decoration: none;
																	"
																	>[Link]. </span
																><span
																	style="
																		font-size: 12pt;
																		font-family: Arial;
																		color: rgb(0, 0, 0);
																		background-color: transparent;
																		font-weight: 400;
																		font-style: normal;
																		font-variant: normal;
																		text-decoration: none;
																	"
																	>Để hoàn tất việc đăng ký, vui lòng xác nhận thông tin qua nút bấm bên
																	dưới.</span
																>
                                                                <div>
																	<a style="display:block;padding:0.75rem 1.25rem;border-radius:0.5rem;color:#fff;text-transform:uppercase;font-size:1rem;text-decoration:none;background-color:#e86357e7;margin:0 auto;text-align:center;width:fit-content;font-family:Arial,sans-serif" href="https://${IS_PRODUCTION ? "dev." : ""}gdsc.app/confirmation?code=${confirmationCode}" target="_blank" data-saferedirecturl="https://www.google.com/url?q=https://forms.gle/Ag3ehG4qdW1vWZKJA&amp;source=gmail&amp;ust=1684908126546000&amp;usg=AOvVaw1alecL8PA9aOvd-bNHMvHQ"><b>Confirmation button</b></a>
																</div>
															</p>
															<p
																dir="ltr"
																style="
																	line-height: 1.872;
																	background-color: rgb(255, 255, 255);
																	margin-top: 0pt;
																	margin-bottom: 0pt;
																">
																<span
																	style="
																		font-size: 12pt;
																		font-family: Arial;
																		color: rgb(0, 0, 0);
																		background-color: transparent;
																		font-weight: 400;
																		font-style: normal;
																		font-variant: normal;
																		text-decoration: none;
																	"
																	>Bên cạnh đó cũng có những mốc thời gian và
																	địa điểm mà các bạn phải lưu ý để tránh bỏ lỡ
																	nhé:</span
																>
															</p>
															<ul
																style="
																	margin-top: 0px;
																	margin-bottom: 0px;
																	padding-inline-start: 48px;
																">
																<li
																	dir="ltr"
																	style="
																		list-style-type: disc;
																		font-size: 12pt;
																		font-family: Arial;
																		color: rgb(0, 0, 0);
																		background-color: transparent;
																		font-weight: 400;
																		font-style: normal;
																		font-variant: normal;
																		text-decoration: none;
																	">
																	<p
																		dir="ltr"
																		style="
																			line-height: 1.872;
																			background-color: rgb(255, 255, 255);
																			margin-top: 0pt;
																			margin-bottom: 0pt;
																		"
																		role="presentation">
																		<span
																			style="
																				font-size: 12pt;
																				font-family: Arial;
																				color: rgb(0, 0, 0);
																				background-color: transparent;
																				font-weight: 400;
																				font-style: normal;
																				font-variant: normal;
																				text-decoration: none;
																			"
																			>Ngày 11/06: </span
																		><span
																			style="
																				font-size: 12pt;
																				font-family: Arial;
																				color: rgb(0, 0, 0);
																				background-color: transparent;
																				font-weight: 700;
																				font-style: normal;
																				font-variant: normal;
																				text-decoration: none;
																			"
																			>GIC Opening day</span
																		><span
																			style="
																				font-size: 12pt;
																				font-family: Arial;
																				color: rgb(0, 0, 0);
																				background-color: transparent;
																				font-weight: 400;
																				font-style: normal;
																				font-variant: normal;
																				text-decoration: none;
																			">
																		</span
																		><span
																			style="
																				font-size: 12pt;
																				font-family: Arial;
																				color: rgb(0, 0, 0);
																				background-color: transparent;
																				font-weight: 700;
																				font-style: normal;
																				font-variant: normal;
																				text-decoration: none;
																			"
																			>(Online 09:00 - 11:25)</span
																		><span
																			style="
																				font-size: 12pt;
																				font-family: Arial;
																				color: rgb(0, 0, 0);
																				background-color: transparent;
																				font-weight: 400;
																				font-style: normal;
																				font-variant: normal;
																				text-decoration: none;
																			"
																			>. Nội dung và ý tưởng cũng như mục tiêu
																			của cuộc thi sẽ được phổ biến cho các thí
																			sinh.</span
																		>
																	</p>
																</li>
																<li
																	dir="ltr"
																	style="
																		list-style-type: disc;
																		font-size: 12pt;
																		font-family: Arial;
																		color: rgb(0, 0, 0);
																		background-color: transparent;
																		font-weight: 400;
																		font-style: normal;
																		font-variant: normal;
																		text-decoration: none;
																	">
																	<p
																		dir="ltr"
																		style="
																			line-height: 1.872;
																			background-color: rgb(255, 255, 255);
																			margin-top: 0pt;
																			margin-bottom: 0pt;
																		"
																		role="presentation">
																		<span
																			style="
																				font-size: 12pt;
																				font-family: Arial;
																				color: rgb(0, 0, 0);
																				background-color: transparent;
																				font-weight: 400;
																				font-style: normal;
																				font-variant: normal;
																				text-decoration: none;
																			"
																			>Ngày 14/06: </span
																		><span
																			style="
																				font-size: 12pt;
																				font-family: Arial;
																				color: rgb(0, 0, 0);
																				background-color: transparent;
																				font-weight: 700;
																				font-style: normal;
																				font-variant: normal;
																				text-decoration: none;
																			"
																			>Seminar “Designing Your Idea”</span
																		><span
																			style="
																				font-size: 12pt;
																				font-family: Arial;
																				color: rgb(0, 0, 0);
																				background-color: transparent;
																				font-weight: 400;
																				font-style: normal;
																				font-variant: normal;
																				text-decoration: none;
																			">
																		</span
																		><span
																			style="
																				font-size: 12pt;
																				font-family: Arial;
																				color: rgb(0, 0, 0);
																				background-color: transparent;
																				font-weight: 700;
																				font-style: normal;
																				font-variant: normal;
																				text-decoration: none;
																			"
																			>(Online 19:00 - 21:15)</span
																		><span
																			style="
																				font-size: 12pt;
																				font-family: Arial;
																				color: rgb(0, 0, 0);
																				background-color: transparent;
																				font-weight: 400;
																				font-style: normal;
																				font-variant: normal;
																				text-decoration: none;
																			"
																			>. Diễn giả sẽ phổ biến thể lệ của cuộc
																			thi cũng như sẽ chia sẻ quy trình làm việc
																			hiệu quả của các dự án công nghệ trong
																			việc lên ý tưởng thông qua </span
																		><span
																			style="
																				font-size: 12pt;
																				font-family: Arial;
																				color: rgb(0, 0, 0);
																				background-color: transparent;
																				font-weight: 700;
																				font-style: normal;
																				font-variant: normal;
																				text-decoration: none;
																			"
																			>Zoom</span
																		><span
																			style="
																				font-size: 12pt;
																				font-family: Arial;
																				color: rgb(0, 0, 0);
																				background-color: transparent;
																				font-weight: 400;
																				font-style: normal;
																				font-variant: normal;
																				text-decoration: none;
																			"
																			>.</span
																		>
																	</p>
																</li>
																<li
																	dir="ltr"
																	style="
																		list-style-type: disc;
																		font-size: 12pt;
																		font-family: Arial;
																		color: rgb(0, 0, 0);
																		background-color: transparent;
																		font-weight: 400;
																		font-style: normal;
																		font-variant: normal;
																		text-decoration: none;
																	">
																	<p
																		dir="ltr"
																		style="
																			line-height: 1.872;
																			background-color: rgb(255, 255, 255);
																			margin-top: 0pt;
																			margin-bottom: 0pt;
																		"
																		role="presentation">
																		<span
																			style="
																				font-size: 12pt;
																				font-family: Arial;
																				color: rgb(0, 0, 0);
																				background-color: transparent;
																				font-weight: 400;
																				font-style: normal;
																				font-variant: normal;
																				text-decoration: none;
																			"
																			>Ngày 17/06: </span
																		><span
																			style="
																				font-size: 12pt;
																				font-family: Arial;
																				color: rgb(0, 0, 0);
																				background-color: transparent;
																				font-weight: 700;
																				font-style: normal;
																				font-variant: normal;
																				text-decoration: none;
																			"
																			>Seminar “Presenting Your Idea”</span
																		><span
																			style="
																				font-size: 12pt;
																				font-family: Arial;
																				color: rgb(0, 0, 0);
																				background-color: transparent;
																				font-weight: 400;
																				font-style: normal;
																				font-variant: normal;
																				text-decoration: none;
																			">
																		</span
																		><span
																			style="
																				font-size: 12pt;
																				font-family: Arial;
																				color: rgb(0, 0, 0);
																				background-color: transparent;
																				font-weight: 700;
																				font-style: normal;
																				font-variant: normal;
																				text-decoration: none;
																			"
																			>(Online 09:00 - 11:30)</span
																		><span
																			style="
																				font-size: 12pt;
																				font-family: Arial;
																				color: rgb(0, 0, 0);
																				background-color: transparent;
																				font-weight: 400;
																				font-style: normal;
																				font-variant: normal;
																				text-decoration: none;
																			"
																			>. Những kỹ năng cần thiết để trình bày ý
																			tưởng và chuyên nghiệp hoá sản phẩm sẽ
																			được diễn giả của sự kiện trình bày thông
																			qua </span
																		><span
																			style="
																				font-size: 12pt;
																				font-family: Arial;
																				color: rgb(0, 0, 0);
																				background-color: transparent;
																				font-weight: 700;
																				font-style: normal;
																				font-variant: normal;
																				text-decoration: none;
																			"
																			>Zoom.</span
																		>
																	</p>
																</li>
																<li
																	dir="ltr"
																	style="
																		list-style-type: disc;
																		font-size: 12pt;
																		font-family: Arial;
																		color: rgb(0, 0, 0);
																		background-color: transparent;
																		font-weight: 400;
																		font-style: normal;
																		font-variant: normal;
																		text-decoration: none;
																	">
																	<p
																		dir="ltr"
																		style="
																			line-height: 1.872;
																			background-color: rgb(255, 255, 255);
																			margin-top: 0pt;
																			margin-bottom: 0pt;
																		"
																		role="presentation">
																		<span
																			style="
																				font-size: 12pt;
																				font-family: Arial;
																				color: rgb(0, 0, 0);
																				background-color: transparent;
																				font-weight: 400;
																				font-style: normal;
																				font-variant: normal;
																				text-decoration: none;
																			"
																			>Ngày 23/06: </span
																		><span
																			style="
																				font-size: 12pt;
																				font-family: Arial;
																				color: rgb(0, 0, 0);
																				background-color: transparent;
																				font-weight: 700;
																				font-style: normal;
																				font-variant: normal;
																				text-decoration: none;
																			"
																			>GIC Internal Presentation</span
																		><span
																			style="
																				font-size: 12pt;
																				font-family: Arial;
																				color: rgb(0, 0, 0);
																				background-color: transparent;
																				font-weight: 400;
																				font-style: normal;
																				font-variant: normal;
																				text-decoration: none;
																			">
																		</span
																		><span
																			style="
																				font-size: 12pt;
																				font-family: Arial;
																				color: rgb(0, 0, 0);
																				background-color: transparent;
																				font-weight: 700;
																				font-style: normal;
																				font-variant: normal;
																				text-decoration: none;
																			"
																			>(Offline 08:00 - 14:30)</span
																		><span
																			style="
																				font-size: 12pt;
																				font-family: Arial;
																				color: rgb(0, 0, 0);
																				background-color: transparent;
																				font-weight: 400;
																				font-style: normal;
																				font-variant: normal;
																				text-decoration: none;
																			"
																			>. Các đội thi sẽ lần lượt trình bày, ban
																			tổ chức sẽ chọn ra </span
																		><span
																			style="
																				font-size: 12pt;
																				font-family: Arial;
																				color: rgb(0, 0, 0);
																				background-color: transparent;
																				font-weight: 700;
																				font-style: normal;
																				font-variant: normal;
																				text-decoration: none;
																			"
																			>4 đội cho vòng thi chung kết. </span
																		><span
																			style="
																				font-size: 12pt;
																				font-family: Arial;
																				color: rgb(0, 0, 0);
																				background-color: transparent;
																				font-weight: 400;
																				font-style: normal;
																				font-variant: normal;
																				text-decoration: none;
																			"
																			>Kèm theo đó sẽ có thêm </span
																		><span
																			style="
																				font-size: 12pt;
																				font-family: Arial;
																				color: rgb(0, 0, 0);
																				background-color: transparent;
																				font-weight: 700;
																				font-style: normal;
																				font-variant: normal;
																				text-decoration: none;
																			"
																			>2 đội thi sẽ được bình chọn trực
																			tuyến</span
																		><span
																			style="
																				font-size: 12pt;
																				font-family: Arial;
																				color: rgb(0, 0, 0);
																				background-color: transparent;
																				font-weight: 400;
																				font-style: normal;
																				font-variant: normal;
																				text-decoration: none;
																			">
																			để tiến vào vòng chung kết.</span
																		>
																	</p>
																</li>
																<li
																	dir="ltr"
																	style="
																		list-style-type: disc;
																		font-size: 12pt;
																		font-family: Arial;
																		color: rgb(0, 0, 0);
																		background-color: transparent;
																		font-weight: 400;
																		font-style: normal;
																		font-variant: normal;
																		text-decoration: none;
																	">
																	<p
																		dir="ltr"
																		style="
																			line-height: 1.872;
																			background-color: rgb(255, 255, 255);
																			margin-top: 0pt;
																			margin-bottom: 10pt;
																		"
																		role="presentation">
																		<span
																			style="
																				font-size: 12pt;
																				font-family: Arial;
																				color: rgb(0, 0, 0);
																				background-color: transparent;
																				font-weight: 400;
																				font-style: normal;
																				font-variant: normal;
																				text-decoration: none;
																			"
																			>Ngày 25/06: </span
																		><span
																			style="
																				font-size: 12pt;
																				font-family: Arial;
																				color: rgb(0, 0, 0);
																				background-color: transparent;
																				font-weight: 700;
																				font-style: normal;
																				font-variant: normal;
																				text-decoration: none;
																			"
																			>GIC Idea Showcase</span
																		><span
																			style="
																				font-size: 12pt;
																				font-family: Arial;
																				color: rgb(0, 0, 0);
																				background-color: transparent;
																				font-weight: 400;
																				font-style: normal;
																				font-variant: normal;
																				text-decoration: none;
																			">
																		</span
																		><span
																			style="
																				font-size: 12pt;
																				font-family: Arial;
																				color: rgb(0, 0, 0);
																				background-color: transparent;
																				font-weight: 700;
																				font-style: normal;
																				font-variant: normal;
																				text-decoration: none;
																			"
																			>(Offline 08:00 - 12:30)</span
																		><span
																			style="
																				font-size: 12pt;
																				font-family: Arial;
																				color: rgb(0, 0, 0);
																				background-color: transparent;
																				font-weight: 400;
																				font-style: normal;
																				font-variant: normal;
																				text-decoration: none;
																			"
																			>. 6 đội được bình chọn trước đó sẽ trình
																			bày ý tưởng sau đó các khán giả và giám
																			khảo sẽ bình chọn cho đội thắng
																			cuộc.</span
																		>
																	</p>
																</li>
															</ul>
															<p
																dir="ltr"
																style="
																	line-height: 1.872;
																	background-color: rgb(255, 255, 255);
																	margin-top: 0pt;
																	margin-bottom: 0pt;
																">
																<span
																	style="
																		font-size: 12pt;
																		font-family: Arial;
																		color: rgb(0, 0, 0);
																		background-color: transparent;
																		font-weight: 400;
																		font-style: normal;
																		font-variant: normal;
																		text-decoration: none;
																	"
																	>Các sự kiện online sẽ được tổ chức thông qua
																	nền tảng </span
																><span
																	style="
																		font-size: 12pt;
																		font-family: Arial;
																		color: rgb(0, 0, 0);
																		background-color: transparent;
																		font-weight: 700;
																		font-style: normal;
																		font-variant: normal;
																		text-decoration: none;
																	"
																	>Zoom:</span
																>
															</p>
															<ul
																style="
																	margin-top: 0px;
																	margin-bottom: 0px;
																	padding-inline-start: 48px;
																">
																<li
																	dir="ltr"
																	style="
																		list-style-type: disc;
																		font-size: 12pt;
																		font-family: Arial;
																		color: rgb(0, 0, 0);
																		background-color: transparent;
																		font-weight: 700;
																		font-style: normal;
																		font-variant: normal;
																		text-decoration: none;
																	">
																	<p
																		dir="ltr"
																		style="
																			line-height: 1.872;
																			background-color: rgb(255, 255, 255);
																			margin-top: 0pt;
																			margin-bottom: 0pt;
																		"
																		role="presentation">
																		<span
																			style="
																				font-size: 12pt;
																				font-family: Arial;
																				color: rgb(0, 0, 0);
																				background-color: transparent;
																				font-weight: 700;
																				font-style: normal;
																				font-variant: normal;
																				text-decoration: none;
																			"
																			>ID:</span
																		>
																	</p>
																</li>
																<li
																	dir="ltr"
																	style="
																		list-style-type: disc;
																		font-size: 12pt;
																		font-family: Arial;
																		color: rgb(0, 0, 0);
																		background-color: transparent;
																		font-weight: 700;
																		font-style: normal;
																		font-variant: normal;
																		text-decoration: none;
																	">
																	<p
																		dir="ltr"
																		style="
																			line-height: 1.872;
																			background-color: rgb(255, 255, 255);
																			margin-top: 0pt;
																			margin-bottom: 10pt;
																		"
																		role="presentation">
																		<span
																			style="
																				font-size: 12pt;
																				font-family: Arial;
																				color: rgb(0, 0, 0);
																				background-color: transparent;
																				font-weight: 700;
																				font-style: normal;
																				font-variant: normal;
																				text-decoration: none;
																			"
																			>Password:</span
																		>
																	</p>
																</li>
															</ul>
															<p
																dir="ltr"
																style="
																	line-height: 1.872;
																	background-color: rgb(255, 255, 255);
																	margin-top: 0pt;
																	margin-bottom: 0pt;
																	padding: 0pt 0pt 10pt;
																">
																<span
																	style="
																		font-size: 12pt;
																		font-family: Arial;
																		color: rgb(0, 0, 0);
																		background-color: transparent;
																		font-weight: 400;
																		font-style: normal;
																		font-variant: normal;
																		text-decoration: none;
																	"
																	>Với hai sự kiện ngày </span
																><span
																	style="
																		font-size: 12pt;
																		font-family: Arial;
																		color: rgb(0, 0, 0);
																		background-color: transparent;
																		font-weight: 700;
																		font-style: normal;
																		font-variant: normal;
																		text-decoration: none;
																	"
																	>23/06</span
																><span
																	style="
																		font-size: 12pt;
																		font-family: Arial;
																		color: rgb(0, 0, 0);
																		background-color: transparent;
																		font-weight: 400;
																		font-style: normal;
																		font-variant: normal;
																		text-decoration: none;
																	">
																	và </span
																><span
																	style="
																		font-size: 12pt;
																		font-family: Arial;
																		color: rgb(0, 0, 0);
																		background-color: transparent;
																		font-weight: 700;
																		font-style: normal;
																		font-variant: normal;
																		text-decoration: none;
																	"
																	>25/05</span
																><span
																	style="
																		font-size: 12pt;
																		font-family: Arial;
																		color: rgb(0, 0, 0);
																		background-color: transparent;
																		font-weight: 400;
																		font-style: normal;
																		font-variant: normal;
																		text-decoration: none;
																	">
																	sẽ được tổ chức tại</span
																><span
																	style="
																		font-size: 12pt;
																		font-family: Arial;
																		color: rgb(0, 0, 0);
																		background-color: transparent;
																		font-weight: 700;
																		font-style: normal;
																		font-variant: normal;
																		text-decoration: none;
																	">
																	Nhà văn hóa sinh viên Đại học Quốc gia
																	TP.HCM</span
																><span
																	style="
																		font-size: 12pt;
																		font-family: Arial;
																		color: rgb(0, 0, 0);
																		background-color: transparent;
																		font-weight: 400;
																		font-style: normal;
																		font-variant: normal;
																		text-decoration: none;
																	">
																	vào các khung giờ nêu trên</span
																><span
																	style="
																		font-size: 12pt;
																		font-family: Arial;
																		color: rgb(0, 0, 0);
																		background-color: transparent;
																		font-weight: 400;
																		font-style: normal;
																		font-variant: normal;
																		text-decoration: none;
																	"
																	>.</span
																>
															</p>
															<p
																dir="ltr"
																style="
																	line-height: 1.872;
																	background-color: rgb(255, 255, 255);
																	margin-top: 0pt;
																	margin-bottom: 0pt;
																">
																<span
																	style="
																		font-size: 12pt;
																		font-family: Arial;
																		color: rgb(0, 0, 0);
																		background-color: transparent;
																		font-weight: 400;
																		font-style: normal;
																		font-variant: normal;
																		text-decoration: none;
																	"
																	>Hãy chuẩn bị cho cuộc thi tốt nhất với những
																	ý tưởng mà các bạn đã ấp ủ. Không chỉ là ý
																	tưởng , trình bày và phản biện cũng sẽ là các
																	kĩ năng các bạn cần phải sở hữu để hoàn thiện
																	dự án. Hãy bắt đầu từ bây giờ, tận dụng mọi cơ
																	hội để giao lưu, chia sẻ và học hỏi sẽ là chìa
																	khóa dẫn đến chiến thắng của các bạn.</span
																>
															</p>
															<p
																dir="ltr"
																style="
																	line-height: 1.872;
																	background-color: rgb(255, 255, 255);
																	margin-top: 0pt;
																	margin-bottom: 0pt;
																	padding: 10pt 0pt;
																">
																<span
																	style="
																		font-size: 12pt;
																		font-family: Arial;
																		color: rgb(0, 0, 0);
																		background-color: transparent;
																		font-weight: 700;
																		font-style: normal;
																		font-variant: normal;
																		text-decoration: none;
																	"
																	>GIC: THiNK 2023</span
																><span
																	style="
																		font-size: 12pt;
																		font-family: Arial;
																		color: rgb(0, 0, 0);
																		background-color: transparent;
																		font-weight: 400;
																		font-style: normal;
																		font-variant: normal;
																		text-decoration: none;
																	">
																	giờ đây sẽ thêm tính cạnh tranh và thú vị hơn
																	bao giờ hết bởi có sự xuất hiện của các thành
																	viên từ đội </span
																><span
																	style="
																		font-size: 12pt;
																		font-family: Arial;
																		color: rgb(0, 0, 0);
																		background-color: transparent;
																		font-weight: 700;
																		font-style: normal;
																		font-variant: normal;
																		text-decoration: none;
																	"
																	>${teamName}</span
																><span
																	style="
																		font-size: 12pt;
																		font-family: Arial;
																		color: rgb(0, 0, 0);
																		background-color: transparent;
																		font-weight: 400;
																		font-style: normal;
																		font-variant: normal;
																		text-decoration: none;
																	">
																	Bởi đó </span
																><span
																	style="
																		font-size: 12pt;
																		font-family: Arial;
																		color: rgb(0, 0, 0);
																		background-color: transparent;
																		font-weight: 700;
																		font-style: normal;
																		font-variant: normal;
																		text-decoration: none;
																	"
																	>GDSC HCMUT</span
																><span
																	style="
																		font-size: 12pt;
																		font-family: Arial;
																		color: rgb(0, 0, 0);
																		background-color: transparent;
																		font-weight: 400;
																		font-style: normal;
																		font-variant: normal;
																		text-decoration: none;
																	">
																	và ban giám khảo sẽ rất mong chờ vào ý tưởng
																	của các bạn và cách các bạn sẽ hiện thực
																	chúng.</span
																>
															</p>
															<p
																dir="ltr"
																style="
																	line-height: 1.656;
																	background-color: rgb(255, 255, 255);
																	margin-top: 0pt;
																	margin-bottom: 0pt;
																">
																<span
																	style="
																		font-size: 12pt;
																		font-family: Arial;
																		color: rgb(0, 0, 0);
																		background-color: transparent;
																		font-weight: 400;
																		font-style: normal;
																		font-variant: normal;
																		text-decoration: none;
																	"
																	>Hy vọng các bạn đã sẵn sàng và tràn đầy năng
																	lượng để thử thách bản thân mình,</span
																>
															</p>
															<p
																dir="ltr"
																style="
																	line-height: 1.656;
																	background-color: rgb(255, 255, 255);
																	margin-top: 0pt;
																	margin-bottom: 0pt;
																	padding: 10pt 0pt 0pt;
																">
																<span
																	style="
																		font-size: 12pt;
																		font-family: Arial;
																		color: rgb(0, 0, 0);
																		background-color: transparent;
																		font-weight: 400;
																		font-style: normal;
																		font-variant: normal;
																		text-decoration: none;
																	"
																	>Chiến thắng./.</span
																>
															</p>
															<p
																dir="ltr"
																style="
																	line-height: 1.656;
																	background-color: rgb(255, 255, 255);
																	margin-top: 0pt;
																	margin-bottom: 0pt;
																	padding: 0pt 0pt 10pt;
																">
																<span
																	style="
																		color: rgb(0, 0, 0);
																		background-color: transparent;
																		font-family: Arial;
																		font-weight: 700;
																		white-space: pre-wrap;
																		text-align: justify;
																	"
																	>--</span
																><br />
															</p>
															<span
																id="m_4733994766360779959m_7286841442065195665gmail-docs-internal-guid-0ee68f09-7fff-5ec6-0994-89a7bbb6040e"
																><p
																	dir="ltr"
																	style="
																		line-height: 1.38;
																		text-align: justify;
																		margin-top: 10pt;
																		margin-bottom: 0pt;
																	">
																	<span
																		style="
																			font-size: 13pt;
																			font-family: Arial;
																			color: rgb(66, 133, 244);
																			background-color: transparent;
																			font-weight: 700;
																			font-variant-numeric: normal;
																			font-variant-east-asian: normal;
																			font-variant-alternates: normal;
																			vertical-align: baseline;
																			white-space: pre-wrap;
																		"
																		>Google Developer Student Club</span
																	><span
																		style="
																			font-size: 13pt;
																			font-family: Arial;
																			color: rgb(66, 133, 244);
																			background-color: transparent;
																			font-weight: 700;
																			font-variant-numeric: normal;
																			font-variant-east-asian: normal;
																			font-variant-alternates: normal;
																		"
																		><br /></span
																	><span
																		style="
																			font-size: 11pt;
																			font-family: Arial;
																			color: rgb(85, 85, 85);
																			background-color: transparent;
																			font-variant-numeric: normal;
																			font-variant-east-asian: normal;
																			font-variant-alternates: normal;
																		"
																		>Ho Chi Minh City University of
																		Technology</span
																	>
																</p>
																<p
																	dir="ltr"
																	style="
																		line-height: 1.38;
																		text-align: justify;
																		margin-top: 0pt;
																		margin-bottom: 0pt;
																		padding: 10pt 0pt 0pt;
																	">
																	<span
																		style="
																			font-size: 10pt;
																			font-family: Arial;
																			color: rgb(85, 85, 85);
																			background-color: transparent;
																			font-weight: 700;
																			font-style: italic;
																			font-variant-numeric: normal;
																			font-variant-east-asian: normal;
																			font-variant-alternates: normal;
																		"
																		>Email: </span
																	><a
																		href="mailto:contact@gdschcmut.dev"
																		style="text-decoration-line: none"
																		target="_blank"
																		><span
																			style="
																				font-size: 10pt;
																				font-family: Arial;
																				background-color: transparent;
																				font-style: italic;
																				font-variant-numeric: normal;
																				font-variant-east-asian: normal;
																				font-variant-alternates: normal;
																				text-decoration-line: underline;
																			"
																			>contact@gdschcmut.dev</span
																		><span
																			style="
																				font-size: 10pt;
																				font-family: Arial;
																				color: rgb(66, 133, 244);
																				background-color: transparent;
																				font-style: italic;
																				font-variant-numeric: normal;
																				font-variant-east-asian: normal;
																				font-variant-alternates: normal;
																			"
																			><br /></span></a
																	><span
																		style="
																			font-size: 10pt;
																			font-family: Arial;
																			color: rgb(85, 85, 85);
																			background-color: transparent;
																			font-weight: 700;
																			font-style: italic;
																			font-variant-numeric: normal;
																			font-variant-east-asian: normal;
																			font-variant-alternates: normal;
																		"
																		>Facebook:</span
																	><a
																		href="https://www.facebook.com/dscxhcmut/"
																		style="text-decoration-line: none"
																		target="_blank"
																		data-saferedirecturl="https://www.google.com/url?q=https://www.facebook.com/dscxhcmut/&amp;source=gmail&amp;ust=1684900982510000&amp;usg=AOvVaw2FhNYsuoPTXwbo4oBIDh0z"
																		><span
																			style="
																				font-size: 10pt;
																				font-family: Arial;
																				background-color: transparent;
																				font-weight: 700;
																				font-style: italic;
																				font-variant-numeric: normal;
																				font-variant-east-asian: normal;
																				font-variant-alternates: normal;
																				text-decoration-line: underline;
																			">
																		</span
																		><span
																			style="
																				font-size: 10pt;
																				font-family: Arial;
																				background-color: transparent;
																				font-style: italic;
																				font-variant-numeric: normal;
																				font-variant-east-asian: normal;
																				font-variant-alternates: normal;
																				text-decoration-line: underline;
																			"
																			>https://www.facebook.com/<wbr />dscxhcmut/</span
																		><span
																			style="
																				font-size: 10pt;
																				font-family: Arial;
																				color: rgb(85, 85, 85);
																				background-color: transparent;
																				font-weight: 700;
																				font-style: italic;
																				font-variant-numeric: normal;
																				font-variant-east-asian: normal;
																				font-variant-alternates: normal;
																			"
																			><br /></span></a
																	><span
																		style="
																			font-size: 10pt;
																			font-family: Arial;
																			color: rgb(85, 85, 85);
																			background-color: transparent;
																			font-weight: 700;
																			font-style: italic;
																			font-variant-numeric: normal;
																			font-variant-east-asian: normal;
																			font-variant-alternates: normal;
																		"
																		>Address:</span
																	><span
																		style="
																			font-size: 10pt;
																			font-family: Arial;
																			color: rgb(85, 85, 85);
																			background-color: transparent;
																			font-style: italic;
																			font-variant-numeric: normal;
																			font-variant-east-asian: normal;
																			font-variant-alternates: normal;
																		">
																		268 Ly Thuong Kiet, Ward 14, District 10, Ho
																		Chi Minh City</span
																	>
																</p></span
															></span
														>
														<table
															cellspacing="0"
															cellpadding="0"
															border="0"
															width="100%">
															<tbody></tbody>
														</table>
													</td>
												</tr>
											</tbody>
										</table>
									</td>
								</tr>

								<tr>
									<td>
										<table
											cellspacing="0"
											cellpadding="0"
											border="0"
											width="100%">
											<tbody>
												<tr>
													<td
														style="
															background-color: #ffffff;
															border-top: 1px solid #f6f7f9;
															padding: 40px 0 40px;
															font-size: 13px;
															color: #7e8890;
														"
														align="center">
														<a
															href="https://streaklinks.com/BT8hHi6ERIjsu_ZJEAk4wpeN/https%3A%2F%2Fu16161593.ct.sendgrid.net%2Fls%2Fclick%3Fupn%3D6FylDzOsBjandYrle4FqVZSdv3-2BbZ0ATs1aFPrX0Lwzg9C4VAJP20noOG84jTS0macmi_J2sXdVe2BnhqC3exzESXAmJMuMzjG71v7RSUsMbKve6Ib29LkCTGRRHZ0UZx9utclyf2jsJXHRWfDwAkctFUwX73MYpmhWoeW8oW3o4G-2BckDWo-2B-2BpTWXVDLrSObETzmtUBODjGL1bz38mFGTyffJb25DGpaEGIiPTR7dq560VdIXaKAEBLq9sVl1-2B-2BRDKL4D0J2OAJTTFSYIs07rHvbIHw-3D-3D"
															target="_blank"
															data-saferedirecturl="https://www.google.com/url?q=https://streaklinks.com/BT8hHi6ERIjsu_ZJEAk4wpeN/https%253A%252F%252Fu16161593.ct.sendgrid.net%252Fls%252Fclick%253Fupn%253D6FylDzOsBjandYrle4FqVZSdv3-2BbZ0ATs1aFPrX0Lwzg9C4VAJP20noOG84jTS0macmi_J2sXdVe2BnhqC3exzESXAmJMuMzjG71v7RSUsMbKve6Ib29LkCTGRRHZ0UZx9utclyf2jsJXHRWfDwAkctFUwX73MYpmhWoeW8oW3o4G-2BckDWo-2B-2BpTWXVDLrSObETzmtUBODjGL1bz38mFGTyffJb25DGpaEGIiPTR7dq560VdIXaKAEBLq9sVl1-2B-2BRDKL4D0J2OAJTTFSYIs07rHvbIHw-3D-3D&amp;source=gmail&amp;ust=1684900982510000&amp;usg=AOvVaw1Jwrn-oNrRwokXitboWfK-"
															><img
																border="0"
																src="https://ci3.googleusercontent.com/proxy/1r-2vzVLcsXOpbFMuS1z_1wAHilkgE7VFmSK2du-iSEE9y_IDtifkp_7W6Tl0I8cWPm-LpQkJJjwV-MWuUOCR9f8ODWCK6t1yzb40sb10EICj67F2A3ZaCIPBmtk9CdzZCBQ65LpsCExriQv8CzuM_4vxPC8UCV_Q6zlmJ5gj3hTZ7ObfIF2nkBXNKBsxB_o8mlvE0HvKyviDRH3jOdMhZUE6f84W3J0mPP3uMuxWfT3vmV9IRKqPAQoC5WlegZTQnruwsQq3A=s0-d-e1-ft#https://res.cloudinary.com/startup-grind/image/upload/c_fit,dpr_2.0,f_auto,g_center,h_60,q_auto:good,w_500/v1/gcs/platform-data-dsc/contentbuilder/logo_dark_horizontal_WVttpzD.png"
																height="30"
														/></a>
													</td>
												</tr>
											</tbody>
										</table>
									</td>
								</tr>
							</tbody>
						</table>
					</td>
				</tr>
			</tbody>
		</table>

		<img
			style="
				height: 1px !important;
				width: 1px !important;
				border-width: 0 !important;
				margin-top: 0 !important;
				margin-bottom: 0 !important;
				margin-right: 0 !important;
				margin-left: 0 !important;
				padding-top: 0 !important;
				padding-bottom: 0 !important;
				padding-right: 0 !important;
				padding-left: 0 !important;
			"
			border="0"
			height="1"
			width="1"
			alt=""
			src="https://ci5.googleusercontent.com/proxy/TM6Pu1jLMfEZO_Tw9fwBSCQg-_Pi4GoWDRH35_cS3oyS5zEJY192JqakvAo1DhL-as5PJ4a6vXaGyc_RBmzAEefu_kEfQ-XVEkQdQyj7H1VrlFa69UU1OjU3_Nq59DjkomUOP8_HQ97JUvlJbMESxO44jsyhXKtDA5jqHp8nRcpNnT1B131kO5lyHPulNQAstGE4pzXGdMBFepwi7Ad_axpSVr6y0jKa1xQzBHoVFIAnSsT0hMIpgUdty2J68SHBvBw9vjZHvbqMNTIaVYPTEHITn5lzsWxlDmXnw3eRc7VG14OFYq_Yijz686eSRqmntwBjI-247ST5KR8mD3v1d0xvJEWIgzCDz3ulJCHPYJaYu3TTRcKeyak4C856HHnEaC3RSa0iRt0UgUUz7zGVufO6bzg8yMqiS5I=s0-d-e1-ft#https://u16161593.ct.sendgrid.net/wf/open?upn=f9BVIBTE4MV61d5WjyC1xRBeR2D0-2FN201XFXTlyGhGyQgyHSETzPOsJgbL-2B6iWKcS5VFV0WSwLBEXJd1jcrJJuKwQm68GVMxsvpPG6KQ1MJzOJFj03Z-2FRqTFChIYweOcYW9QeGejF3u-2F9B11dZqzfjxleppWee-2FQ7IDcefEpxjuVE12hEsfPoZJNwF1utRzsCPvDW4FPYrxy3On5PFdlWE7kzdkn5ZSFwW1Pu2CyJj4-3D" />
	</div>
	<br />
</div>
    `
}

export function CONTEST_REGISTRATION_SUCCESSFUL_EMAIL(
    receiver: string,
    teamName: string,
) {
    return `
    <div dir="ltr">
	<div
		style="
			background-color: #f6f7f9;
			margin: 0;
			padding: 0;
			font-family: 'Open Sans', Arial, sans-serif !important;
			font-weight: 400;
			color: #202124;
		">
		<div></div>
		<table cellpadding="15" cellspacing="0" border="0" width="100%">
			<tbody>
				<tr>
					<td style="background-color: #f6f7f9" align="center" width="100%">
						<table
							style="
								border-bottom-left-radius: 4px;
								border-bottom-right-radius: 4px;
								overflow: hidden;
								min-width: 290px;
								max-width: 600px;
							"
							cellspacing="0"
							cellpadding="0"
							border="0">
							<tbody>
								<tr>
									<td>
										<table
											cellspacing="0"
											cellpadding="0"
											border="0"
											width="100%">
											<tbody>
												<tr>
													<td
														style="
															padding: 0 0 15px;
															font-family: 'Open Sans', Arial, sans-serif !important;
														"
														valign="middle">
														<a
															style="
																font-size: 12px;
																color: #6f6f6f !important;
																padding: 1px 0;
																text-decoration: none !important;
															"
															href="https://streaklinks.com/BT8hHi6i4sz87Zu_jgWlHBim/https%3A%2F%2Fu16161593.ct.sendgrid.net%2Fls%2Fclick%3Fupn%3D6FylDzOsBjandYrle4FqVZSdv3-2BbZ0ATs1aFPrX0LwznXXv5-2BoPgUHFt4ZMWenhtzqm7TjwMiA-2FFAAcTgMmUzqjVEhGztoc3RXmIWr31f9U-3DI0CU_J2sXdVe2BnhqC3exzESXAmJMuMzjG71v7RSUsMbKve6Ib29LkCTGRRHZ0UZx9utc0IXBPSuXDsulPt-2BMuYAqYyOAd83zZixxdWawNN-2BT-2BiEAS7-2Bs49aOD3vNf7i12oczTvTKAg7vnxumi6yz7-2BrLhBQeoo95o72ChUsisLrcxpHCbTdj3-2Fpf0KoNR-2B9tXM6uj3lrwEddbE5MTql81MA0wQ-3D-3D"
															target="_blank"
															data-saferedirecturl="https://www.google.com/url?q=https://streaklinks.com/BT8hHi6i4sz87Zu_jgWlHBim/https%253A%252F%252Fu16161593.ct.sendgrid.net%252Fls%252Fclick%253Fupn%253D6FylDzOsBjandYrle4FqVZSdv3-2BbZ0ATs1aFPrX0LwznXXv5-2BoPgUHFt4ZMWenhtzqm7TjwMiA-2FFAAcTgMmUzqjVEhGztoc3RXmIWr31f9U-3DI0CU_J2sXdVe2BnhqC3exzESXAmJMuMzjG71v7RSUsMbKve6Ib29LkCTGRRHZ0UZx9utc0IXBPSuXDsulPt-2BMuYAqYyOAd83zZixxdWawNN-2BT-2BiEAS7-2Bs49aOD3vNf7i12oczTvTKAg7vnxumi6yz7-2BrLhBQeoo95o72ChUsisLrcxpHCbTdj3-2Fpf0KoNR-2B9tXM6uj3lrwEddbE5MTql81MA0wQ-3D-3D&amp;source=gmail&amp;ust=1684900982510000&amp;usg=AOvVaw2hcgQx-yyLguam3pt8qVxw">
															Google Developer Student Clubs - VNU HCM -
															University of Technology
														</a>
													</td>

													<td
														style="
															padding: 0 0 15px;
															font-family: 'Open Sans', Arial, sans-serif !important;
														"
														valign="middle"
														align="right">
														<br />
													</td>
												</tr>
											</tbody>
										</table>
									</td>
								</tr>

								<tr>
									<td
										style="
											width: 600px;
											height: 136px;
											vertical-align: middle;
											border-bottom: 0px solid #f6f7f9;
											background-image: url(https://ci3.googleusercontent.com/proxy/jTbSl0_Srn4p-vihHLXnamvPIRqeZxUV8BUKAc3K9e9SGOUfkrvcSD4lXc-hrT8Xy6TJTpGAoO1_1YQhcYJhuyEUTFyhmZKHILgw709SiBMN2jTydWgf-PLxJc7UJrg8BTjB7aVfi1k1LjsoJov1dIrrxeNjzDGWSWctWk0mu2U2Ob7UM1QWU8BrNTkvaA8PdcQqyhXjlHU-J7n3k5vcCTHI6QZno8Eei93sXQGLfNiw_9nWGxWmgA=s0-d-e1-ft#https://res.cloudinary.com/startup-grind/image/upload/c_fill,dpr_2.0,f_auto,g_center,h_135,q_auto:eco,w_600/v1/gcs/platform-data-dsc/contentbuilder/email_header.png);
											background-color: #fff;
											border-top-right-radius: 4px;
											border-top-left-radius: 4px;
											background-size: cover;
										">
										<table
											style="width: 100%"
											width="100%"
											cellspacing="20"
											cellpadding="0"
											border="0">
											<tbody>
												<tr>
													<td
														style="vertical-align: middle; text-align: center">
														<div style="display: inline-block">
															<a
																style="text-align: center; display: block"
																href="https://streaklinks.com/BT8hHi6PT1YYETjglwM_Hm9E/https%3A%2F%2Fu16161593.ct.sendgrid.net%2Fls%2Fclick%3Fupn%3D6FylDzOsBjandYrle4FqVZSdv3-2BbZ0ATs1aFPrX0LwznXXv5-2BoPgUHFt4ZMWenhtzqm7TjwMiA-2FFAAcTgMmUzqjVEhGztoc3RXmIWr31f9U-3D1WWW_J2sXdVe2BnhqC3exzESXAmJMuMzjG71v7RSUsMbKve6Ib29LkCTGRRHZ0UZx9utcOdQF6JS3ei-2Fi-2B544Dvf86oqppqJ8ierQQhGgjkxucq7fumdIZnstg-2BFUndpO-2FfxP4Ly3TP4GzCOy9ht90I8WESMt6kPH7KOOCcKJJqWM79bCah4CxTulb6AN7wK5cJ2S-2FdFuFhMq1xCBL1vObinRiQ-3D-3D"
																target="_blank"
																data-saferedirecturl="https://www.google.com/url?q=https://streaklinks.com/BT8hHi6PT1YYETjglwM_Hm9E/https%253A%252F%252Fu16161593.ct.sendgrid.net%252Fls%252Fclick%253Fupn%253D6FylDzOsBjandYrle4FqVZSdv3-2BbZ0ATs1aFPrX0LwznXXv5-2BoPgUHFt4ZMWenhtzqm7TjwMiA-2FFAAcTgMmUzqjVEhGztoc3RXmIWr31f9U-3D1WWW_J2sXdVe2BnhqC3exzESXAmJMuMzjG71v7RSUsMbKve6Ib29LkCTGRRHZ0UZx9utcOdQF6JS3ei-2Fi-2B544Dvf86oqppqJ8ierQQhGgjkxucq7fumdIZnstg-2BFUndpO-2FfxP4Ly3TP4GzCOy9ht90I8WESMt6kPH7KOOCcKJJqWM79bCah4CxTulb6AN7wK5cJ2S-2FdFuFhMq1xCBL1vObinRiQ-3D-3D&amp;source=gmail&amp;ust=1684900982510000&amp;usg=AOvVaw3gBg_MMpNAgWKpAVsRMA0Y">
																<img
																	height="50"
																	border="0"
																	alt="Google Developer Student Clubs"
																	src="https://ci3.googleusercontent.com/proxy/wEsj66QGvdQacrMw4Qm3A1r-Gbyd3Uz7XY2HRkhxyXCxKpzCzuqi2KlBu70FVmRXCvpd7HqgnKJFFW2ga4xiGnLgF1jjWDvQfTAgMBbC_onFujTrhFAl99zrDBLsS6moSRMG2EAHgFGRL2dLMbG-0GkgcVd3pOEeeTJzZzhI6CuspG6FeRi177hNC7sRe2INLGkoVoVMrgzZhPiZs4HnGot13yae4p1VnyKpydIqCwul8OV7wDdlCBT8EQ9K6HTlNVMM49A=s0-d-e1-ft#https://res.cloudinary.com/startup-grind/image/upload/c_fit,dpr_2.0,f_auto,g_center,h_100,q_auto:good,w_500/v1/gcs/platform-data-dsc/contentbuilder/logo_dark_stacked_ziDh4mP.png" />
															</a>
														</div>
													</td>
												</tr>
											</tbody>
										</table>
									</td>
								</tr>

								<tr>
									<td style="padding-top: 1px">
										<table
											cellspacing="0"
											cellpadding="0"
											border="0"
											width="100%">
											<tbody>
												<tr>
													<td
														style="
															background-color: #fff;
															padding: 25px 35px;
															text-align: left;
															font-family: 'Open Sans', Arial, sans-serif !important;
															font-size: 14px;
															line-height: 20px;
														"
														align="center"
														valign="top">
														<span
															id="m_4733994766360779959m_7286841442065195665m_-7246610426249120709gmail-docs-internal-guid-1795923a-7fff-3ee5-47f8-07a4555c096e"
															><p
																dir="ltr"
																style="
																	line-height: 1.656;
																	background-color: rgb(255, 255, 255);
																	margin-top: 0pt;
																	margin-bottom: 0pt;
																	padding: 0pt 0pt 10pt;
																">
																<span
																	style="
																		font-variant-numeric: normal;
																		font-variant-east-asian: normal;
																		font-variant-alternates: normal;
																		font-size: 12pt;
																		font-family: Arial;
																		color: rgb(0, 0, 0);
																		background-color: transparent;
																	"
																	>Xin chào </span
																><span
																	style="
																		font-variant-numeric: normal;
																		font-variant-east-asian: normal;
																		font-variant-alternates: normal;
																		font-size: 12pt;
																		font-family: Arial;
																		color: rgb(0, 0, 0);
																		background-color: transparent;
																		font-weight: 700;
																	"
																	>${receiver}</span
																><span
																	style="
																		font-variant-numeric: normal;
																		font-variant-east-asian: normal;
																		font-variant-alternates: normal;
																		font-size: 12pt;
																		font-family: Arial;
																		color: rgb(0, 0, 0);
																		background-color: transparent;
																	"
																	>,</span
																><br />
															</p>
															<p
																dir="ltr"
																style="
																	line-height: 1.872;
																	background-color: rgb(255, 255, 255);
																	margin-top: 0pt;
																	margin-bottom: 0pt;
																	padding: 0pt 0pt 10pt;
																">
																<span
																	style="
																		font-size: 12pt;
																		font-family: Arial;
																		color: rgb(0, 0, 0);
																		background-color: transparent;
																		font-weight: 400;
																		font-style: normal;
																		font-variant: normal;
																		text-decoration: none;
																	"
																	>Chúc mừng đội </span
																><span
																	style="
																		font-size: 12pt;
																		font-family: Arial;
																		color: rgb(0, 0, 0);
																		background-color: transparent;
																		font-weight: 700;
																		font-style: normal;
																		font-variant: normal;
																		text-decoration: none;
																	"
																	>${teamName}</span
																><span
																	style="
																		font-size: 12pt;
																		font-family: Arial;
																		color: rgb(0, 0, 0);
																		background-color: transparent;
																		font-weight: 400;
																		font-style: normal;
																		font-variant: normal;
																		text-decoration: none;
																	">
																	đã đăng ký thành công và trở thành một phần
																	của cuộc thi GDSC Idea Contest: THiNK
																	2023.&nbsp;</span
																>
															</p>
															<p
																dir="ltr"
																style="
																	line-height: 1.872;
																	background-color: rgb(255, 255, 255);
																	margin-top: 0pt;
																	margin-bottom: 0pt;
																	padding: 0pt 0pt 10pt;
																">
																<span
																	style="
																		font-size: 12pt;
																		font-family: Arial;
																		color: rgb(0, 0, 0);
																		background-color: transparent;
																		font-weight: 400;
																		font-style: normal;
																		font-variant: normal;
																		text-decoration: none;
																	"
																	>Thông tin của các đội thi sẽ được cập nhật ở
																	website cuộc thi </span
																><span
																	style="
																		font-size: 12pt;
																		font-family: Arial;
																		color: rgb(0, 0, 0);
																		background-color: transparent;
																		font-weight: 700;
																		font-style: normal;
																		font-variant: normal;
																		text-decoration: none;
																	"
																	>[Link]</span
																><span
																	style="
																		font-size: 12pt;
																		font-family: Arial;
																		color: rgb(0, 0, 0);
																		background-color: transparent;
																		font-weight: 400;
																		font-style: normal;
																		font-variant: normal;
																		text-decoration: none;
																	"
                                                                >. Bên cạnh đó cũng có những mốc thời gian và
																	địa điểm mà các bạn phải lưu ý để tránh bỏ lỡ
																	nhé:</span>
															</p>
															<ul
																style="
																	margin-top: 0px;
																	margin-bottom: 0px;
																	padding-inline-start: 48px;
																">
																<li
																	dir="ltr"
																	style="
																		list-style-type: disc;
																		font-size: 12pt;
																		font-family: Arial;
																		color: rgb(0, 0, 0);
																		background-color: transparent;
																		font-weight: 400;
																		font-style: normal;
																		font-variant: normal;
																		text-decoration: none;
																	">
																	<p
																		dir="ltr"
																		style="
																			line-height: 1.872;
																			background-color: rgb(255, 255, 255);
																			margin-top: 0pt;
																			margin-bottom: 0pt;
																		"
																		role="presentation">
																		<span
																			style="
																				font-size: 12pt;
																				font-family: Arial;
																				color: rgb(0, 0, 0);
																				background-color: transparent;
																				font-weight: 400;
																				font-style: normal;
																				font-variant: normal;
																				text-decoration: none;
																			"
																			>Ngày 11/06: </span
																		><span
																			style="
																				font-size: 12pt;
																				font-family: Arial;
																				color: rgb(0, 0, 0);
																				background-color: transparent;
																				font-weight: 700;
																				font-style: normal;
																				font-variant: normal;
																				text-decoration: none;
																			"
																			>GIC Opening day</span
																		><span
																			style="
																				font-size: 12pt;
																				font-family: Arial;
																				color: rgb(0, 0, 0);
																				background-color: transparent;
																				font-weight: 400;
																				font-style: normal;
																				font-variant: normal;
																				text-decoration: none;
																			">
																		</span
																		><span
																			style="
																				font-size: 12pt;
																				font-family: Arial;
																				color: rgb(0, 0, 0);
																				background-color: transparent;
																				font-weight: 700;
																				font-style: normal;
																				font-variant: normal;
																				text-decoration: none;
																			"
																			>(Online 09:00 - 11:25)</span
																		><span
																			style="
																				font-size: 12pt;
																				font-family: Arial;
																				color: rgb(0, 0, 0);
																				background-color: transparent;
																				font-weight: 400;
																				font-style: normal;
																				font-variant: normal;
																				text-decoration: none;
																			"
																			>. Nội dung và ý tưởng cũng như mục tiêu
																			của cuộc thi sẽ được phổ biến cho các thí
																			sinh.</span
																		>
																	</p>
																</li>
																<li
																	dir="ltr"
																	style="
																		list-style-type: disc;
																		font-size: 12pt;
																		font-family: Arial;
																		color: rgb(0, 0, 0);
																		background-color: transparent;
																		font-weight: 400;
																		font-style: normal;
																		font-variant: normal;
																		text-decoration: none;
																	">
																	<p
																		dir="ltr"
																		style="
																			line-height: 1.872;
																			background-color: rgb(255, 255, 255);
																			margin-top: 0pt;
																			margin-bottom: 0pt;
																		"
																		role="presentation">
																		<span
																			style="
																				font-size: 12pt;
																				font-family: Arial;
																				color: rgb(0, 0, 0);
																				background-color: transparent;
																				font-weight: 400;
																				font-style: normal;
																				font-variant: normal;
																				text-decoration: none;
																			"
																			>Ngày 14/06: </span
																		><span
																			style="
																				font-size: 12pt;
																				font-family: Arial;
																				color: rgb(0, 0, 0);
																				background-color: transparent;
																				font-weight: 700;
																				font-style: normal;
																				font-variant: normal;
																				text-decoration: none;
																			"
																			>Seminar “Designing Your Idea”</span
																		><span
																			style="
																				font-size: 12pt;
																				font-family: Arial;
																				color: rgb(0, 0, 0);
																				background-color: transparent;
																				font-weight: 400;
																				font-style: normal;
																				font-variant: normal;
																				text-decoration: none;
																			">
																		</span
																		><span
																			style="
																				font-size: 12pt;
																				font-family: Arial;
																				color: rgb(0, 0, 0);
																				background-color: transparent;
																				font-weight: 700;
																				font-style: normal;
																				font-variant: normal;
																				text-decoration: none;
																			"
																			>(Online 19:00 - 21:15)</span
																		><span
																			style="
																				font-size: 12pt;
																				font-family: Arial;
																				color: rgb(0, 0, 0);
																				background-color: transparent;
																				font-weight: 400;
																				font-style: normal;
																				font-variant: normal;
																				text-decoration: none;
																			"
																			>. Diễn giả sẽ phổ biến thể lệ của cuộc
																			thi cũng như sẽ chia sẻ quy trình làm việc
																			hiệu quả của các dự án công nghệ trong
																			việc lên ý tưởng thông qua </span
																		><span
																			style="
																				font-size: 12pt;
																				font-family: Arial;
																				color: rgb(0, 0, 0);
																				background-color: transparent;
																				font-weight: 700;
																				font-style: normal;
																				font-variant: normal;
																				text-decoration: none;
																			"
																			>Zoom</span
																		><span
																			style="
																				font-size: 12pt;
																				font-family: Arial;
																				color: rgb(0, 0, 0);
																				background-color: transparent;
																				font-weight: 400;
																				font-style: normal;
																				font-variant: normal;
																				text-decoration: none;
																			"
																			>.</span
																		>
																	</p>
																</li>
																<li
																	dir="ltr"
																	style="
																		list-style-type: disc;
																		font-size: 12pt;
																		font-family: Arial;
																		color: rgb(0, 0, 0);
																		background-color: transparent;
																		font-weight: 400;
																		font-style: normal;
																		font-variant: normal;
																		text-decoration: none;
																	">
																	<p
																		dir="ltr"
																		style="
																			line-height: 1.872;
																			background-color: rgb(255, 255, 255);
																			margin-top: 0pt;
																			margin-bottom: 0pt;
																		"
																		role="presentation">
																		<span
																			style="
																				font-size: 12pt;
																				font-family: Arial;
																				color: rgb(0, 0, 0);
																				background-color: transparent;
																				font-weight: 400;
																				font-style: normal;
																				font-variant: normal;
																				text-decoration: none;
																			"
																			>Ngày 17/06: </span
																		><span
																			style="
																				font-size: 12pt;
																				font-family: Arial;
																				color: rgb(0, 0, 0);
																				background-color: transparent;
																				font-weight: 700;
																				font-style: normal;
																				font-variant: normal;
																				text-decoration: none;
																			"
																			>Seminar “Presenting Your Idea”</span
																		><span
																			style="
																				font-size: 12pt;
																				font-family: Arial;
																				color: rgb(0, 0, 0);
																				background-color: transparent;
																				font-weight: 400;
																				font-style: normal;
																				font-variant: normal;
																				text-decoration: none;
																			">
																		</span
																		><span
																			style="
																				font-size: 12pt;
																				font-family: Arial;
																				color: rgb(0, 0, 0);
																				background-color: transparent;
																				font-weight: 700;
																				font-style: normal;
																				font-variant: normal;
																				text-decoration: none;
																			"
																			>(Online 09:00 - 11:30)</span
																		><span
																			style="
																				font-size: 12pt;
																				font-family: Arial;
																				color: rgb(0, 0, 0);
																				background-color: transparent;
																				font-weight: 400;
																				font-style: normal;
																				font-variant: normal;
																				text-decoration: none;
																			"
																			>. Những kỹ năng cần thiết để trình bày ý
																			tưởng và chuyên nghiệp hoá sản phẩm sẽ
																			được diễn giả của sự kiện trình bày thông
																			qua </span
																		><span
																			style="
																				font-size: 12pt;
																				font-family: Arial;
																				color: rgb(0, 0, 0);
																				background-color: transparent;
																				font-weight: 700;
																				font-style: normal;
																				font-variant: normal;
																				text-decoration: none;
																			"
																			>Zoom.</span
																		>
																	</p>
																</li>
																<li
																	dir="ltr"
																	style="
																		list-style-type: disc;
																		font-size: 12pt;
																		font-family: Arial;
																		color: rgb(0, 0, 0);
																		background-color: transparent;
																		font-weight: 400;
																		font-style: normal;
																		font-variant: normal;
																		text-decoration: none;
																	">
																	<p
																		dir="ltr"
																		style="
																			line-height: 1.872;
																			background-color: rgb(255, 255, 255);
																			margin-top: 0pt;
																			margin-bottom: 0pt;
																		"
																		role="presentation">
																		<span
																			style="
																				font-size: 12pt;
																				font-family: Arial;
																				color: rgb(0, 0, 0);
																				background-color: transparent;
																				font-weight: 400;
																				font-style: normal;
																				font-variant: normal;
																				text-decoration: none;
																			"
																			>Ngày 23/06: </span
																		><span
																			style="
																				font-size: 12pt;
																				font-family: Arial;
																				color: rgb(0, 0, 0);
																				background-color: transparent;
																				font-weight: 700;
																				font-style: normal;
																				font-variant: normal;
																				text-decoration: none;
																			"
																			>GIC Internal Presentation</span
																		><span
																			style="
																				font-size: 12pt;
																				font-family: Arial;
																				color: rgb(0, 0, 0);
																				background-color: transparent;
																				font-weight: 400;
																				font-style: normal;
																				font-variant: normal;
																				text-decoration: none;
																			">
																		</span
																		><span
																			style="
																				font-size: 12pt;
																				font-family: Arial;
																				color: rgb(0, 0, 0);
																				background-color: transparent;
																				font-weight: 700;
																				font-style: normal;
																				font-variant: normal;
																				text-decoration: none;
																			"
																			>(Offline 08:00 - 14:30)</span
																		><span
																			style="
																				font-size: 12pt;
																				font-family: Arial;
																				color: rgb(0, 0, 0);
																				background-color: transparent;
																				font-weight: 400;
																				font-style: normal;
																				font-variant: normal;
																				text-decoration: none;
																			"
																			>. Các đội thi sẽ lần lượt trình bày, ban
																			tổ chức sẽ chọn ra </span
																		><span
																			style="
																				font-size: 12pt;
																				font-family: Arial;
																				color: rgb(0, 0, 0);
																				background-color: transparent;
																				font-weight: 700;
																				font-style: normal;
																				font-variant: normal;
																				text-decoration: none;
																			"
																			>4 đội cho vòng thi chung kết. </span
																		><span
																			style="
																				font-size: 12pt;
																				font-family: Arial;
																				color: rgb(0, 0, 0);
																				background-color: transparent;
																				font-weight: 400;
																				font-style: normal;
																				font-variant: normal;
																				text-decoration: none;
																			"
																			>Kèm theo đó sẽ có thêm </span
																		><span
																			style="
																				font-size: 12pt;
																				font-family: Arial;
																				color: rgb(0, 0, 0);
																				background-color: transparent;
																				font-weight: 700;
																				font-style: normal;
																				font-variant: normal;
																				text-decoration: none;
																			"
																			>2 đội thi sẽ được bình chọn trực
																			tuyến</span
																		><span
																			style="
																				font-size: 12pt;
																				font-family: Arial;
																				color: rgb(0, 0, 0);
																				background-color: transparent;
																				font-weight: 400;
																				font-style: normal;
																				font-variant: normal;
																				text-decoration: none;
																			">
																			để tiến vào vòng chung kết.</span
																		>
																	</p>
																</li>
																<li
																	dir="ltr"
																	style="
																		list-style-type: disc;
																		font-size: 12pt;
																		font-family: Arial;
																		color: rgb(0, 0, 0);
																		background-color: transparent;
																		font-weight: 400;
																		font-style: normal;
																		font-variant: normal;
																		text-decoration: none;
																	">
																	<p
																		dir="ltr"
																		style="
																			line-height: 1.872;
																			background-color: rgb(255, 255, 255);
																			margin-top: 0pt;
																			margin-bottom: 10pt;
																		"
																		role="presentation">
																		<span
																			style="
																				font-size: 12pt;
																				font-family: Arial;
																				color: rgb(0, 0, 0);
																				background-color: transparent;
																				font-weight: 400;
																				font-style: normal;
																				font-variant: normal;
																				text-decoration: none;
																			"
																			>Ngày 25/06: </span
																		><span
																			style="
																				font-size: 12pt;
																				font-family: Arial;
																				color: rgb(0, 0, 0);
																				background-color: transparent;
																				font-weight: 700;
																				font-style: normal;
																				font-variant: normal;
																				text-decoration: none;
																			"
																			>GIC Idea Showcase</span
																		><span
																			style="
																				font-size: 12pt;
																				font-family: Arial;
																				color: rgb(0, 0, 0);
																				background-color: transparent;
																				font-weight: 400;
																				font-style: normal;
																				font-variant: normal;
																				text-decoration: none;
																			">
																		</span
																		><span
																			style="
																				font-size: 12pt;
																				font-family: Arial;
																				color: rgb(0, 0, 0);
																				background-color: transparent;
																				font-weight: 700;
																				font-style: normal;
																				font-variant: normal;
																				text-decoration: none;
																			"
																			>(Offline 08:00 - 12:30)</span
																		><span
																			style="
																				font-size: 12pt;
																				font-family: Arial;
																				color: rgb(0, 0, 0);
																				background-color: transparent;
																				font-weight: 400;
																				font-style: normal;
																				font-variant: normal;
																				text-decoration: none;
																			"
																			>. 6 đội được bình chọn trước đó sẽ trình
																			bày ý tưởng sau đó các khán giả và giám
																			khảo sẽ bình chọn cho đội thắng
																			cuộc.</span
																		>
																	</p>
																</li>
															</ul>
															<p
																dir="ltr"
																style="
																	line-height: 1.872;
																	background-color: rgb(255, 255, 255);
																	margin-top: 0pt;
																	margin-bottom: 0pt;
																">
																<span
																	style="
																		font-size: 12pt;
																		font-family: Arial;
																		color: rgb(0, 0, 0);
																		background-color: transparent;
																		font-weight: 400;
																		font-style: normal;
																		font-variant: normal;
																		text-decoration: none;
																	"
																	>Các sự kiện online sẽ được tổ chức thông qua
																	nền tảng </span
																><span
																	style="
																		font-size: 12pt;
																		font-family: Arial;
																		color: rgb(0, 0, 0);
																		background-color: transparent;
																		font-weight: 700;
																		font-style: normal;
																		font-variant: normal;
																		text-decoration: none;
																	"
																	>Zoom:</span
																>
															</p>
															<ul
																style="
																	margin-top: 0px;
																	margin-bottom: 0px;
																	padding-inline-start: 48px;
																">
																<li
																	dir="ltr"
																	style="
																		list-style-type: disc;
																		font-size: 12pt;
																		font-family: Arial;
																		color: rgb(0, 0, 0);
																		background-color: transparent;
																		font-weight: 700;
																		font-style: normal;
																		font-variant: normal;
																		text-decoration: none;
																	">
																	<p
																		dir="ltr"
																		style="
																			line-height: 1.872;
																			background-color: rgb(255, 255, 255);
																			margin-top: 0pt;
																			margin-bottom: 0pt;
																		"
																		role="presentation">
																		<span
																			style="
																				font-size: 12pt;
																				font-family: Arial;
																				color: rgb(0, 0, 0);
																				background-color: transparent;
																				font-weight: 700;
																				font-style: normal;
																				font-variant: normal;
																				text-decoration: none;
																			"
																			>ID:</span
																		>
																	</p>
																</li>
																<li
																	dir="ltr"
																	style="
																		list-style-type: disc;
																		font-size: 12pt;
																		font-family: Arial;
																		color: rgb(0, 0, 0);
																		background-color: transparent;
																		font-weight: 700;
																		font-style: normal;
																		font-variant: normal;
																		text-decoration: none;
																	">
																	<p
																		dir="ltr"
																		style="
																			line-height: 1.872;
																			background-color: rgb(255, 255, 255);
																			margin-top: 0pt;
																			margin-bottom: 10pt;
																		"
																		role="presentation">
																		<span
																			style="
																				font-size: 12pt;
																				font-family: Arial;
																				color: rgb(0, 0, 0);
																				background-color: transparent;
																				font-weight: 700;
																				font-style: normal;
																				font-variant: normal;
																				text-decoration: none;
																			"
																			>Password:</span
																		>
																	</p>
																</li>
															</ul>
															<p
																dir="ltr"
																style="
																	line-height: 1.872;
																	background-color: rgb(255, 255, 255);
																	margin-top: 0pt;
																	margin-bottom: 0pt;
																	padding: 0pt 0pt 10pt;
																">
																<span
																	style="
																		font-size: 12pt;
																		font-family: Arial;
																		color: rgb(0, 0, 0);
																		background-color: transparent;
																		font-weight: 400;
																		font-style: normal;
																		font-variant: normal;
																		text-decoration: none;
																	"
																	>Với hai sự kiện ngày </span
																><span
																	style="
																		font-size: 12pt;
																		font-family: Arial;
																		color: rgb(0, 0, 0);
																		background-color: transparent;
																		font-weight: 700;
																		font-style: normal;
																		font-variant: normal;
																		text-decoration: none;
																	"
																	>23/06</span
																><span
																	style="
																		font-size: 12pt;
																		font-family: Arial;
																		color: rgb(0, 0, 0);
																		background-color: transparent;
																		font-weight: 400;
																		font-style: normal;
																		font-variant: normal;
																		text-decoration: none;
																	">
																	và </span
																><span
																	style="
																		font-size: 12pt;
																		font-family: Arial;
																		color: rgb(0, 0, 0);
																		background-color: transparent;
																		font-weight: 700;
																		font-style: normal;
																		font-variant: normal;
																		text-decoration: none;
																	"
																	>25/05</span
																><span
																	style="
																		font-size: 12pt;
																		font-family: Arial;
																		color: rgb(0, 0, 0);
																		background-color: transparent;
																		font-weight: 400;
																		font-style: normal;
																		font-variant: normal;
																		text-decoration: none;
																	">
																	sẽ được tổ chức tại</span
																><span
																	style="
																		font-size: 12pt;
																		font-family: Arial;
																		color: rgb(0, 0, 0);
																		background-color: transparent;
																		font-weight: 700;
																		font-style: normal;
																		font-variant: normal;
																		text-decoration: none;
																	">
																	Nhà văn hóa sinh viên Đại học Quốc gia
																	TP.HCM</span
																><span
																	style="
																		font-size: 12pt;
																		font-family: Arial;
																		color: rgb(0, 0, 0);
																		background-color: transparent;
																		font-weight: 400;
																		font-style: normal;
																		font-variant: normal;
																		text-decoration: none;
																	">
																	vào các khung giờ nêu trên</span
																><span
																	style="
																		font-size: 12pt;
																		font-family: Arial;
																		color: rgb(0, 0, 0);
																		background-color: transparent;
																		font-weight: 400;
																		font-style: normal;
																		font-variant: normal;
																		text-decoration: none;
																	"
																	>.</span
																>
															</p>
															<p
																dir="ltr"
																style="
																	line-height: 1.872;
																	background-color: rgb(255, 255, 255);
																	margin-top: 0pt;
																	margin-bottom: 0pt;
																">
																<span
																	style="
																		font-size: 12pt;
																		font-family: Arial;
																		color: rgb(0, 0, 0);
																		background-color: transparent;
																		font-weight: 400;
																		font-style: normal;
																		font-variant: normal;
																		text-decoration: none;
																	"
																	>Hãy chuẩn bị cho cuộc thi tốt nhất với những
																	ý tưởng mà các bạn đã ấp ủ. Không chỉ là ý
																	tưởng , trình bày và phản biện cũng sẽ là các
																	kĩ năng các bạn cần phải sở hữu để hoàn thiện
																	dự án. Hãy bắt đầu từ bây giờ, tận dụng mọi cơ
																	hội để giao lưu, chia sẻ và học hỏi sẽ là chìa
																	khóa dẫn đến chiến thắng của các bạn.</span
																>
															</p>
															<p
																dir="ltr"
																style="
																	line-height: 1.872;
																	background-color: rgb(255, 255, 255);
																	margin-top: 0pt;
																	margin-bottom: 0pt;
																	padding: 10pt 0pt;
																">
																<span
																	style="
																		font-size: 12pt;
																		font-family: Arial;
																		color: rgb(0, 0, 0);
																		background-color: transparent;
																		font-weight: 700;
																		font-style: normal;
																		font-variant: normal;
																		text-decoration: none;
																	"
																	>GIC: THiNK 2023</span
																><span
																	style="
																		font-size: 12pt;
																		font-family: Arial;
																		color: rgb(0, 0, 0);
																		background-color: transparent;
																		font-weight: 400;
																		font-style: normal;
																		font-variant: normal;
																		text-decoration: none;
																	">
																	giờ đây sẽ thêm tính cạnh tranh và thú vị hơn
																	bao giờ hết bởi có sự xuất hiện của các thành
																	viên từ đội </span
																><span
																	style="
																		font-size: 12pt;
																		font-family: Arial;
																		color: rgb(0, 0, 0);
																		background-color: transparent;
																		font-weight: 700;
																		font-style: normal;
																		font-variant: normal;
																		text-decoration: none;
																	"
																	>${teamName}</span
																><span
																	style="
																		font-size: 12pt;
																		font-family: Arial;
																		color: rgb(0, 0, 0);
																		background-color: transparent;
																		font-weight: 400;
																		font-style: normal;
																		font-variant: normal;
																		text-decoration: none;
																	">
																	Bởi đó </span
																><span
																	style="
																		font-size: 12pt;
																		font-family: Arial;
																		color: rgb(0, 0, 0);
																		background-color: transparent;
																		font-weight: 700;
																		font-style: normal;
																		font-variant: normal;
																		text-decoration: none;
																	"
																	>GDSC HCMUT</span
																><span
																	style="
																		font-size: 12pt;
																		font-family: Arial;
																		color: rgb(0, 0, 0);
																		background-color: transparent;
																		font-weight: 400;
																		font-style: normal;
																		font-variant: normal;
																		text-decoration: none;
																	">
																	và ban giám khảo sẽ rất mong chờ vào ý tưởng
																	của các bạn và cách các bạn sẽ hiện thực
																	chúng.</span
																>
															</p>
															<p
																dir="ltr"
																style="
																	line-height: 1.656;
																	background-color: rgb(255, 255, 255);
																	margin-top: 0pt;
																	margin-bottom: 0pt;
																">
																<span
																	style="
																		font-size: 12pt;
																		font-family: Arial;
																		color: rgb(0, 0, 0);
																		background-color: transparent;
																		font-weight: 400;
																		font-style: normal;
																		font-variant: normal;
																		text-decoration: none;
																	"
																	>Hy vọng các bạn đã sẵn sàng và tràn đầy năng
																	lượng để thử thách bản thân mình,</span
																>
															</p>
															<p
																dir="ltr"
																style="
																	line-height: 1.656;
																	background-color: rgb(255, 255, 255);
																	margin-top: 0pt;
																	margin-bottom: 0pt;
																	padding: 10pt 0pt 0pt;
																">
																<span
																	style="
																		font-size: 12pt;
																		font-family: Arial;
																		color: rgb(0, 0, 0);
																		background-color: transparent;
																		font-weight: 400;
																		font-style: normal;
																		font-variant: normal;
																		text-decoration: none;
																	"
																	>Chiến thắng./.</span
																>
															</p>
															<p
																dir="ltr"
																style="
																	line-height: 1.656;
																	background-color: rgb(255, 255, 255);
																	margin-top: 0pt;
																	margin-bottom: 0pt;
																	padding: 0pt 0pt 10pt;
																">
																<span
																	style="
																		color: rgb(0, 0, 0);
																		background-color: transparent;
																		font-family: Arial;
																		font-weight: 700;
																		white-space: pre-wrap;
																		text-align: justify;
																	"
																	>--</span
																><br />
															</p>
															<span
																id="m_4733994766360779959m_7286841442065195665gmail-docs-internal-guid-0ee68f09-7fff-5ec6-0994-89a7bbb6040e"
																><p
																	dir="ltr"
																	style="
																		line-height: 1.38;
																		text-align: justify;
																		margin-top: 10pt;
																		margin-bottom: 0pt;
																	">
																	<span
																		style="
																			font-size: 13pt;
																			font-family: Arial;
																			color: rgb(66, 133, 244);
																			background-color: transparent;
																			font-weight: 700;
																			font-variant-numeric: normal;
																			font-variant-east-asian: normal;
																			font-variant-alternates: normal;
																			vertical-align: baseline;
																			white-space: pre-wrap;
																		"
																		>Google Developer Student Club</span
																	><span
																		style="
																			font-size: 13pt;
																			font-family: Arial;
																			color: rgb(66, 133, 244);
																			background-color: transparent;
																			font-weight: 700;
																			font-variant-numeric: normal;
																			font-variant-east-asian: normal;
																			font-variant-alternates: normal;
																		"
																		><br /></span
																	><span
																		style="
																			font-size: 11pt;
																			font-family: Arial;
																			color: rgb(85, 85, 85);
																			background-color: transparent;
																			font-variant-numeric: normal;
																			font-variant-east-asian: normal;
																			font-variant-alternates: normal;
																		"
																		>Ho Chi Minh City University of
																		Technology</span
																	>
																</p>
																<p
																	dir="ltr"
																	style="
																		line-height: 1.38;
																		text-align: justify;
																		margin-top: 0pt;
																		margin-bottom: 0pt;
																		padding: 10pt 0pt 0pt;
																	">
																	<span
																		style="
																			font-size: 10pt;
																			font-family: Arial;
																			color: rgb(85, 85, 85);
																			background-color: transparent;
																			font-weight: 700;
																			font-style: italic;
																			font-variant-numeric: normal;
																			font-variant-east-asian: normal;
																			font-variant-alternates: normal;
																		"
																		>Email: </span
																	><a
																		href="mailto:contact@gdschcmut.dev"
																		style="text-decoration-line: none"
																		target="_blank"
																		><span
																			style="
																				font-size: 10pt;
																				font-family: Arial;
																				background-color: transparent;
																				font-style: italic;
																				font-variant-numeric: normal;
																				font-variant-east-asian: normal;
																				font-variant-alternates: normal;
																				text-decoration-line: underline;
																			"
																			>contact@gdschcmut.dev</span
																		><span
																			style="
																				font-size: 10pt;
																				font-family: Arial;
																				color: rgb(66, 133, 244);
																				background-color: transparent;
																				font-style: italic;
																				font-variant-numeric: normal;
																				font-variant-east-asian: normal;
																				font-variant-alternates: normal;
																			"
																			><br /></span></a
																	><span
																		style="
																			font-size: 10pt;
																			font-family: Arial;
																			color: rgb(85, 85, 85);
																			background-color: transparent;
																			font-weight: 700;
																			font-style: italic;
																			font-variant-numeric: normal;
																			font-variant-east-asian: normal;
																			font-variant-alternates: normal;
																		"
																		>Facebook:</span
																	><a
																		href="https://www.facebook.com/dscxhcmut/"
																		style="text-decoration-line: none"
																		target="_blank"
																		data-saferedirecturl="https://www.google.com/url?q=https://www.facebook.com/dscxhcmut/&amp;source=gmail&amp;ust=1684900982510000&amp;usg=AOvVaw2FhNYsuoPTXwbo4oBIDh0z"
																		><span
																			style="
																				font-size: 10pt;
																				font-family: Arial;
																				background-color: transparent;
																				font-weight: 700;
																				font-style: italic;
																				font-variant-numeric: normal;
																				font-variant-east-asian: normal;
																				font-variant-alternates: normal;
																				text-decoration-line: underline;
																			">
																		</span
																		><span
																			style="
																				font-size: 10pt;
																				font-family: Arial;
																				background-color: transparent;
																				font-style: italic;
																				font-variant-numeric: normal;
																				font-variant-east-asian: normal;
																				font-variant-alternates: normal;
																				text-decoration-line: underline;
																			"
																			>https://www.facebook.com/<wbr />dscxhcmut/</span
																		><span
																			style="
																				font-size: 10pt;
																				font-family: Arial;
																				color: rgb(85, 85, 85);
																				background-color: transparent;
																				font-weight: 700;
																				font-style: italic;
																				font-variant-numeric: normal;
																				font-variant-east-asian: normal;
																				font-variant-alternates: normal;
																			"
																			><br /></span></a
																	><span
																		style="
																			font-size: 10pt;
																			font-family: Arial;
																			color: rgb(85, 85, 85);
																			background-color: transparent;
																			font-weight: 700;
																			font-style: italic;
																			font-variant-numeric: normal;
																			font-variant-east-asian: normal;
																			font-variant-alternates: normal;
																		"
																		>Address:</span
																	><span
																		style="
																			font-size: 10pt;
																			font-family: Arial;
																			color: rgb(85, 85, 85);
																			background-color: transparent;
																			font-style: italic;
																			font-variant-numeric: normal;
																			font-variant-east-asian: normal;
																			font-variant-alternates: normal;
																		">
																		268 Ly Thuong Kiet, Ward 14, District 10, Ho
																		Chi Minh City</span
																	>
																</p></span
															></span
														>
														<table
															cellspacing="0"
															cellpadding="0"
															border="0"
															width="100%">
															<tbody></tbody>
														</table>
													</td>
												</tr>
											</tbody>
										</table>
									</td>
								</tr>

								<tr>
									<td>
										<table
											cellspacing="0"
											cellpadding="0"
											border="0"
											width="100%">
											<tbody>
												<tr>
													<td
														style="
															background-color: #ffffff;
															border-top: 1px solid #f6f7f9;
															padding: 40px 0 40px;
															font-size: 13px;
															color: #7e8890;
														"
														align="center">
														<a
															href="https://streaklinks.com/BT8hHi6ERIjsu_ZJEAk4wpeN/https%3A%2F%2Fu16161593.ct.sendgrid.net%2Fls%2Fclick%3Fupn%3D6FylDzOsBjandYrle4FqVZSdv3-2BbZ0ATs1aFPrX0Lwzg9C4VAJP20noOG84jTS0macmi_J2sXdVe2BnhqC3exzESXAmJMuMzjG71v7RSUsMbKve6Ib29LkCTGRRHZ0UZx9utclyf2jsJXHRWfDwAkctFUwX73MYpmhWoeW8oW3o4G-2BckDWo-2B-2BpTWXVDLrSObETzmtUBODjGL1bz38mFGTyffJb25DGpaEGIiPTR7dq560VdIXaKAEBLq9sVl1-2B-2BRDKL4D0J2OAJTTFSYIs07rHvbIHw-3D-3D"
															target="_blank"
															data-saferedirecturl="https://www.google.com/url?q=https://streaklinks.com/BT8hHi6ERIjsu_ZJEAk4wpeN/https%253A%252F%252Fu16161593.ct.sendgrid.net%252Fls%252Fclick%253Fupn%253D6FylDzOsBjandYrle4FqVZSdv3-2BbZ0ATs1aFPrX0Lwzg9C4VAJP20noOG84jTS0macmi_J2sXdVe2BnhqC3exzESXAmJMuMzjG71v7RSUsMbKve6Ib29LkCTGRRHZ0UZx9utclyf2jsJXHRWfDwAkctFUwX73MYpmhWoeW8oW3o4G-2BckDWo-2B-2BpTWXVDLrSObETzmtUBODjGL1bz38mFGTyffJb25DGpaEGIiPTR7dq560VdIXaKAEBLq9sVl1-2B-2BRDKL4D0J2OAJTTFSYIs07rHvbIHw-3D-3D&amp;source=gmail&amp;ust=1684900982510000&amp;usg=AOvVaw1Jwrn-oNrRwokXitboWfK-"
															><img
																border="0"
																src="https://ci3.googleusercontent.com/proxy/1r-2vzVLcsXOpbFMuS1z_1wAHilkgE7VFmSK2du-iSEE9y_IDtifkp_7W6Tl0I8cWPm-LpQkJJjwV-MWuUOCR9f8ODWCK6t1yzb40sb10EICj67F2A3ZaCIPBmtk9CdzZCBQ65LpsCExriQv8CzuM_4vxPC8UCV_Q6zlmJ5gj3hTZ7ObfIF2nkBXNKBsxB_o8mlvE0HvKyviDRH3jOdMhZUE6f84W3J0mPP3uMuxWfT3vmV9IRKqPAQoC5WlegZTQnruwsQq3A=s0-d-e1-ft#https://res.cloudinary.com/startup-grind/image/upload/c_fit,dpr_2.0,f_auto,g_center,h_60,q_auto:good,w_500/v1/gcs/platform-data-dsc/contentbuilder/logo_dark_horizontal_WVttpzD.png"
																height="30"
														/></a>
													</td>
												</tr>
											</tbody>
										</table>
									</td>
								</tr>
							</tbody>
						</table>
					</td>
				</tr>
			</tbody>
		</table>

		<img
			style="
				height: 1px !important;
				width: 1px !important;
				border-width: 0 !important;
				margin-top: 0 !important;
				margin-bottom: 0 !important;
				margin-right: 0 !important;
				margin-left: 0 !important;
				padding-top: 0 !important;
				padding-bottom: 0 !important;
				padding-right: 0 !important;
				padding-left: 0 !important;
			"
			border="0"
			height="1"
			width="1"
			alt=""
			src="https://ci5.googleusercontent.com/proxy/TM6Pu1jLMfEZO_Tw9fwBSCQg-_Pi4GoWDRH35_cS3oyS5zEJY192JqakvAo1DhL-as5PJ4a6vXaGyc_RBmzAEefu_kEfQ-XVEkQdQyj7H1VrlFa69UU1OjU3_Nq59DjkomUOP8_HQ97JUvlJbMESxO44jsyhXKtDA5jqHp8nRcpNnT1B131kO5lyHPulNQAstGE4pzXGdMBFepwi7Ad_axpSVr6y0jKa1xQzBHoVFIAnSsT0hMIpgUdty2J68SHBvBw9vjZHvbqMNTIaVYPTEHITn5lzsWxlDmXnw3eRc7VG14OFYq_Yijz686eSRqmntwBjI-247ST5KR8mD3v1d0xvJEWIgzCDz3ulJCHPYJaYu3TTRcKeyak4C856HHnEaC3RSa0iRt0UgUUz7zGVufO6bzg8yMqiS5I=s0-d-e1-ft#https://u16161593.ct.sendgrid.net/wf/open?upn=f9BVIBTE4MV61d5WjyC1xRBeR2D0-2FN201XFXTlyGhGyQgyHSETzPOsJgbL-2B6iWKcS5VFV0WSwLBEXJd1jcrJJuKwQm68GVMxsvpPG6KQ1MJzOJFj03Z-2FRqTFChIYweOcYW9QeGejF3u-2F9B11dZqzfjxleppWee-2FQ7IDcefEpxjuVE12hEsfPoZJNwF1utRzsCPvDW4FPYrxy3On5PFdlWE7kzdkn5ZSFwW1Pu2CyJj4-3D" />
	</div>
	<br />
</div>
    `
}

export function DAY_1_4_REGISTRATION_SUCCESSFUL_EMAIL(
    receiver: string,
    idForQR: Types.ObjectId // id of the registration record
) {
    return `
    <div dir="ltr">
	<div
		style="
			background-color: #f6f7f9;
			margin: 0;
			padding: 0;
			font-family: 'Open Sans', Arial, sans-serif !important;
			font-weight: 400;
			color: #202124;
		">
		<div></div>
		<table cellpadding="15" cellspacing="0" border="0" width="100%">
			<tbody>
				<tr>
					<td style="background-color: #f6f7f9" align="center" width="100%">
						<table
							style="
								border-bottom-left-radius: 4px;
								border-bottom-right-radius: 4px;
								overflow: hidden;
								min-width: 290px;
								max-width: 600px;
							"
							cellspacing="0"
							cellpadding="0"
							border="0">
							<tbody>
								<tr>
									<td>
										<table
											cellspacing="0"
											cellpadding="0"
											border="0"
											width="100%">
											<tbody>
												<tr>
													<td
														style="
															padding: 0 0 15px;
															font-family: 'Open Sans', Arial, sans-serif !important;
														"
														valign="middle">
														<a
															style="
																font-size: 12px;
																color: #6f6f6f !important;
																padding: 1px 0;
																text-decoration: none !important;
															"
															href="https://streaklinks.com/BT8hHi6i4sz87Zu_jgWlHBim/https%3A%2F%2Fu16161593.ct.sendgrid.net%2Fls%2Fclick%3Fupn%3D6FylDzOsBjandYrle4FqVZSdv3-2BbZ0ATs1aFPrX0LwznXXv5-2BoPgUHFt4ZMWenhtzqm7TjwMiA-2FFAAcTgMmUzqjVEhGztoc3RXmIWr31f9U-3DI0CU_J2sXdVe2BnhqC3exzESXAmJMuMzjG71v7RSUsMbKve6Ib29LkCTGRRHZ0UZx9utc0IXBPSuXDsulPt-2BMuYAqYyOAd83zZixxdWawNN-2BT-2BiEAS7-2Bs49aOD3vNf7i12oczTvTKAg7vnxumi6yz7-2BrLhBQeoo95o72ChUsisLrcxpHCbTdj3-2Fpf0KoNR-2B9tXM6uj3lrwEddbE5MTql81MA0wQ-3D-3D"
															target="_blank"
															data-saferedirecturl="https://www.google.com/url?q=https://streaklinks.com/BT8hHi6i4sz87Zu_jgWlHBim/https%253A%252F%252Fu16161593.ct.sendgrid.net%252Fls%252Fclick%253Fupn%253D6FylDzOsBjandYrle4FqVZSdv3-2BbZ0ATs1aFPrX0LwznXXv5-2BoPgUHFt4ZMWenhtzqm7TjwMiA-2FFAAcTgMmUzqjVEhGztoc3RXmIWr31f9U-3DI0CU_J2sXdVe2BnhqC3exzESXAmJMuMzjG71v7RSUsMbKve6Ib29LkCTGRRHZ0UZx9utc0IXBPSuXDsulPt-2BMuYAqYyOAd83zZixxdWawNN-2BT-2BiEAS7-2Bs49aOD3vNf7i12oczTvTKAg7vnxumi6yz7-2BrLhBQeoo95o72ChUsisLrcxpHCbTdj3-2Fpf0KoNR-2B9tXM6uj3lrwEddbE5MTql81MA0wQ-3D-3D&amp;source=gmail&amp;ust=1684859221061000&amp;usg=AOvVaw0ezGJtM5x-bu-b1w1OTady">
															Google Developer Student Clubs - VNU HCM -
															University of Technology
														</a>
													</td>

													<td
														style="
															padding: 0 0 15px;
															font-family: 'Open Sans', Arial, sans-serif !important;
														"
														valign="middle"
														align="right">
														<br />
													</td>
												</tr>
											</tbody>
										</table>
									</td>
								</tr>

								<tr>
									<td
										style="
											width: 600px;
											height: 136px;
											vertical-align: middle;
											border-bottom: 0px solid #f6f7f9;
											background-image: url(https://ci3.googleusercontent.com/proxy/jTbSl0_Srn4p-vihHLXnamvPIRqeZxUV8BUKAc3K9e9SGOUfkrvcSD4lXc-hrT8Xy6TJTpGAoO1_1YQhcYJhuyEUTFyhmZKHILgw709SiBMN2jTydWgf-PLxJc7UJrg8BTjB7aVfi1k1LjsoJov1dIrrxeNjzDGWSWctWk0mu2U2Ob7UM1QWU8BrNTkvaA8PdcQqyhXjlHU-J7n3k5vcCTHI6QZno8Eei93sXQGLfNiw_9nWGxWmgA=s0-d-e1-ft#https://res.cloudinary.com/startup-grind/image/upload/c_fill,dpr_2.0,f_auto,g_center,h_135,q_auto:eco,w_600/v1/gcs/platform-data-dsc/contentbuilder/email_header.png);
											background-color: #fff;
											border-top-right-radius: 4px;
											border-top-left-radius: 4px;
											background-size: cover;
										">
										<table
											style="width: 100%"
											width="100%"
											cellspacing="20"
											cellpadding="0"
											border="0">
											<tbody>
												<tr>
													<td
														style="vertical-align: middle; text-align: center">
														<div style="display: inline-block">
															<a
																style="text-align: center; display: block"
																href="https://streaklinks.com/BT8hHi6PT1YYETjglwM_Hm9E/https%3A%2F%2Fu16161593.ct.sendgrid.net%2Fls%2Fclick%3Fupn%3D6FylDzOsBjandYrle4FqVZSdv3-2BbZ0ATs1aFPrX0LwznXXv5-2BoPgUHFt4ZMWenhtzqm7TjwMiA-2FFAAcTgMmUzqjVEhGztoc3RXmIWr31f9U-3D1WWW_J2sXdVe2BnhqC3exzESXAmJMuMzjG71v7RSUsMbKve6Ib29LkCTGRRHZ0UZx9utcOdQF6JS3ei-2Fi-2B544Dvf86oqppqJ8ierQQhGgjkxucq7fumdIZnstg-2BFUndpO-2FfxP4Ly3TP4GzCOy9ht90I8WESMt6kPH7KOOCcKJJqWM79bCah4CxTulb6AN7wK5cJ2S-2FdFuFhMq1xCBL1vObinRiQ-3D-3D"
																target="_blank"
																data-saferedirecturl="https://www.google.com/url?q=https://streaklinks.com/BT8hHi6PT1YYETjglwM_Hm9E/https%253A%252F%252Fu16161593.ct.sendgrid.net%252Fls%252Fclick%253Fupn%253D6FylDzOsBjandYrle4FqVZSdv3-2BbZ0ATs1aFPrX0LwznXXv5-2BoPgUHFt4ZMWenhtzqm7TjwMiA-2FFAAcTgMmUzqjVEhGztoc3RXmIWr31f9U-3D1WWW_J2sXdVe2BnhqC3exzESXAmJMuMzjG71v7RSUsMbKve6Ib29LkCTGRRHZ0UZx9utcOdQF6JS3ei-2Fi-2B544Dvf86oqppqJ8ierQQhGgjkxucq7fumdIZnstg-2BFUndpO-2FfxP4Ly3TP4GzCOy9ht90I8WESMt6kPH7KOOCcKJJqWM79bCah4CxTulb6AN7wK5cJ2S-2FdFuFhMq1xCBL1vObinRiQ-3D-3D&amp;source=gmail&amp;ust=1684859221061000&amp;usg=AOvVaw1a4Y44IdmJtY8kY9E4zhOL">
																<img
																	height="50"
																	border="0"
																	alt="Google Developer Student Clubs"
																	src="https://ci3.googleusercontent.com/proxy/wEsj66QGvdQacrMw4Qm3A1r-Gbyd3Uz7XY2HRkhxyXCxKpzCzuqi2KlBu70FVmRXCvpd7HqgnKJFFW2ga4xiGnLgF1jjWDvQfTAgMBbC_onFujTrhFAl99zrDBLsS6moSRMG2EAHgFGRL2dLMbG-0GkgcVd3pOEeeTJzZzhI6CuspG6FeRi177hNC7sRe2INLGkoVoVMrgzZhPiZs4HnGot13yae4p1VnyKpydIqCwul8OV7wDdlCBT8EQ9K6HTlNVMM49A=s0-d-e1-ft#https://res.cloudinary.com/startup-grind/image/upload/c_fit,dpr_2.0,f_auto,g_center,h_100,q_auto:good,w_500/v1/gcs/platform-data-dsc/contentbuilder/logo_dark_stacked_ziDh4mP.png" />
															</a>
														</div>
													</td>
												</tr>
											</tbody>
										</table>
									</td>
								</tr>

								<tr>
									<td style="padding-top: 1px">
										<table
											cellspacing="0"
											cellpadding="0"
											border="0"
											width="100%">
											<tbody>
												<tr>
													<td
														style="
															background-color: #fff;
															padding: 25px 35px;
															text-align: left;
															font-family: 'Open Sans', Arial, sans-serif !important;
															font-size: 14px;
															line-height: 20px;
														"
														align="center"
														valign="top">
														<span
															id="m_-5174430959820603938m_8590484024401273439m_-7246610426249120709gmail-docs-internal-guid-1795923a-7fff-3ee5-47f8-07a4555c096e"
															><p
																dir="ltr"
																style="
																	line-height: 1.656;
																	background-color: rgb(255, 255, 255);
																	margin-top: 0pt;
																	margin-bottom: 0pt;
																	padding: 0pt 0pt 10pt;
																">
																<span
																	style="
																		font-size: 12pt;
																		font-family: Arial;
																		color: rgb(0, 0, 0);
																		background-color: transparent;
																		font-weight: 400;
																		font-style: normal;
																		font-variant: normal;
																		text-decoration: none;
																	"
																	>Xin chào </span
																><span
																	style="
																		font-size: 12pt;
																		font-family: Arial;
																		color: rgb(0, 0, 0);
																		background-color: transparent;
																		font-weight: 700;
																		font-style: normal;
																		font-variant: normal;
																		text-decoration: none;
																	"
																	>${receiver}</span
																><span
																	style="
																		font-size: 12pt;
																		font-family: Arial;
																		color: rgb(0, 0, 0);
																		background-color: transparent;
																		font-weight: 400;
																		font-style: normal;
																		font-variant: normal;
																		text-decoration: none;
																	"
																	>,</span
																>
															</p>
															<p
																dir="ltr"
																style="
																	line-height: 1.872;
																	background-color: rgb(255, 255, 255);
																	margin-top: 0pt;
																	margin-bottom: 0pt;
																	padding: 0pt 0pt 10pt;
																">
																<span
																	style="
																		font-size: 12pt;
																		font-family: Arial;
																		color: rgb(0, 0, 0);
																		background-color: transparent;
																		font-weight: 400;
																		font-style: normal;
																		font-variant: normal;
																		text-decoration: none;
																	"
																	>Chúc mừng </span
																><span
																	style="
																		font-size: 12pt;
																		font-family: Arial;
																		color: rgb(0, 0, 0);
																		background-color: transparent;
																		font-weight: 700;
																		font-style: normal;
																		font-variant: normal;
																		text-decoration: none;
																	"
																	>${receiver}</span
																>

																<span
																	style="
																		font-size: 12pt;
																		font-family: Arial;
																		color: rgb(0, 0, 0);
																		background-color: transparent;
																		font-weight: 400;
																		font-style: normal;
																		font-variant: normal;
																		text-decoration: none;
																	">
																	đã đăng ký thành công và trở thành một phần
																	của của sự kiện </span
																><span
																	style="
																		font-size: 12pt;
																		font-family: Arial;
																		color: rgb(0, 0, 0);
																		background-color: transparent;
																		font-weight: 700;
																		font-style: normal;
																		font-variant: normal;
																		text-decoration: none;
																	"
																	>[Event name] </span
																><span
																	style="
																		font-size: 12pt;
																		font-family: Arial;
																		color: rgb(0, 0, 0);
																		background-color: transparent;
																		font-weight: 400;
																		font-style: normal;
																		font-variant: normal;
																		text-decoration: none;
																	"
																	>trong chuỗi </span
																><span
																	style="
																		font-size: 12pt;
																		font-family: Arial;
																		color: rgb(0, 0, 0);
																		background-color: transparent;
																		font-weight: 700;
																		font-style: normal;
																		font-variant: normal;
																		text-decoration: none;
																	"
																	>GDSC Idea Contest: THiNK 2023. </span
																><span
																	style="
																		font-size: 12pt;
																		font-family: Arial;
																		color: rgb(0, 0, 0);
																		background-color: transparent;
																		font-weight: 400;
																		font-style: normal;
																		font-variant: normal;
																		text-decoration: none;
																	"
																	>Đây sẽ là mã QR code dùng để checkin sự kiện
																	cũng như tham gia các hoạt động của chuỗi cuộc
																	thi.</span
																>
															</p>
															<div
																style="
																	display: flex;
																	justify-content: center;
																	margin-bottom: 10pt;
																">
																<img
																	src="https://dev.api.fessior.com/gic/qr/${idForQR.toString()}"
																	style="width: 40%" />
															</div>
															<p
																dir="ltr"
																style="
																	line-height: 1.872;
																	background-color: rgb(255, 255, 255);
																	margin-top: 0pt;
																	margin-bottom: 10pt;
																">
																<span
																	style="
																		font-size: 12pt;
																		font-family: Arial;
																		color: rgb(0, 0, 0);
																		background-color: transparent;
																		font-weight: 700;
																		font-style: normal;
																		font-variant: normal;
																		text-decoration: none;
																	"
																	>GIC: THiNK 2023</span
																><span
																	style="
																		font-size: 12pt;
																		font-family: Arial;
																		color: rgb(0, 0, 0);
																		background-color: transparent;
																		font-weight: 400;
																		font-style: normal;
																		font-variant: normal;
																		text-decoration: none;
																	">
																	giờ đây sẽ thêm thú vị hơn bởi có sự xuất hiện
																	bạn. Đừng quên những thông tin của sự kiện bạn
																	đã đăng ký nhé:</span
																>
															</p>
															<ul
																style="
																	margin-top: 0px;
																	margin-bottom: 0px;
																	padding-inline-start: 48px;
																">
																<li
																	dir="ltr"
																	style="
																		list-style-type: disc;
																		font-size: 12pt;
																		font-family: Arial;
																		color: rgb(0, 0, 0);
																		background-color: transparent;
																		font-weight: 400;
																		font-style: normal;
																		font-variant: normal;
																		text-decoration: none;
																	">
																	<p
																		dir="ltr"
																		style="
																			line-height: 1.872;
																			background-color: rgb(255, 255, 255);
																			margin-top: 0pt;
																			margin-bottom: 10pt;
																		"
																		role="presentation">
																		<span
																			style="
																				font-size: 12pt;
																				font-family: Arial;
																				color: rgb(0, 0, 0);
																				background-color: transparent;
																				font-weight: 400;
																				font-style: normal;
																				font-variant: normal;
																				text-decoration: none;
																			"
																			>Ngày 11/06: </span
																		><span
																			style="
																				font-size: 12pt;
																				font-family: Arial;
																				color: rgb(0, 0, 0);
																				background-color: transparent;
																				font-weight: 700;
																				font-style: normal;
																				font-variant: normal;
																				text-decoration: none;
																			"
																			>GIC Opening day</span
																		><span
																			style="
																				font-size: 12pt;
																				font-family: Arial;
																				color: rgb(0, 0, 0);
																				background-color: transparent;
																				font-weight: 400;
																				font-style: normal;
																				font-variant: normal;
																				text-decoration: none;
																			">
																		</span
																		><span
																			style="
																				font-size: 12pt;
																				font-family: Arial;
																				color: rgb(0, 0, 0);
																				background-color: transparent;
																				font-weight: 700;
																				font-style: normal;
																				font-variant: normal;
																				text-decoration: none;
																			"
																			>(Online 09:00 - 11:25)</span
																		><span
																			style="
																				font-size: 12pt;
																				font-family: Arial;
																				color: rgb(0, 0, 0);
																				background-color: transparent;
																				font-weight: 400;
																				font-style: normal;
																				font-variant: normal;
																				text-decoration: none;
																			"
																			>. Nội dung và ý tưởng cũng như mục tiêu
																			của cuộc thi sẽ được phổ biến cho các thí
																			sinh.</span
																		>
																	</p>
																</li>
															</ul>
															<p
																dir="ltr"
																style="
																	line-height: 1.872;
																	background-color: rgb(255, 255, 255);
																	margin-top: 0pt;
																	margin-bottom: 0pt;
																">
																<span
																	style="
																		font-size: 12pt;
																		font-family: Arial;
																		color: rgb(0, 0, 0);
																		background-color: transparent;
																		font-weight: 400;
																		font-style: normal;
																		font-variant: normal;
																		text-decoration: none;
																	"
																	>Đối với các sự kiện online sẽ được tổ chức
																	thông qua nền tảng </span
																><span
																	style="
																		font-size: 12pt;
																		font-family: Arial;
																		color: rgb(0, 0, 0);
																		background-color: transparent;
																		font-weight: 700;
																		font-style: normal;
																		font-variant: normal;
																		text-decoration: none;
																	"
																	>Zoom:</span
																>
															</p>
															<ul
																style="
																	margin-top: 0px;
																	margin-bottom: 0px;
																	padding-inline-start: 48px;
																">
																<li
																	dir="ltr"
																	style="
																		list-style-type: disc;
																		font-size: 12pt;
																		font-family: Arial;
																		color: rgb(0, 0, 0);
																		background-color: transparent;
																		font-weight: 700;
																		font-style: normal;
																		font-variant: normal;
																		text-decoration: none;
																	">
																	<p
																		dir="ltr"
																		style="
																			line-height: 1.872;
																			background-color: rgb(255, 255, 255);
																			margin-top: 0pt;
																			margin-bottom: 0pt;
																		"
																		role="presentation">
																		<span
																			style="
																				font-size: 12pt;
																				font-family: Arial;
																				color: rgb(0, 0, 0);
																				background-color: transparent;
																				font-weight: 700;
																				font-style: normal;
																				font-variant: normal;
																				text-decoration: none;
																			"
																			>ID:</span
																		>
																	</p>
																</li>
																<li
																	dir="ltr"
																	style="
																		list-style-type: disc;
																		font-size: 12pt;
																		font-family: Arial;
																		color: rgb(0, 0, 0);
																		background-color: transparent;
																		font-weight: 700;
																		font-style: normal;
																		font-variant: normal;
																		text-decoration: none;
																	">
																	<p
																		dir="ltr"
																		style="
																			line-height: 1.872;
																			background-color: rgb(255, 255, 255);
																			margin-top: 0pt;
																			margin-bottom: 10pt;
																		"
																		role="presentation">
																		<span
																			style="
																				font-size: 12pt;
																				font-family: Arial;
																				color: rgb(0, 0, 0);
																				background-color: transparent;
																				font-weight: 700;
																				font-style: normal;
																				font-variant: normal;
																				text-decoration: none;
																			"
																			>Password:</span
																		>
																	</p>
																</li>
															</ul>
															<p
																dir="ltr"
																style="
																	line-height: 1.872;
																	background-color: rgb(255, 255, 255);
																	margin-top: 0pt;
																	margin-bottom: 0pt;
																">
																<span
																	style="
																		font-size: 12pt;
																		font-family: Arial;
																		color: rgb(0, 0, 0);
																		background-color: transparent;
																		font-weight: 400;
																		font-style: normal;
																		font-variant: normal;
																		text-decoration: none;
																	"
																	>Bên cạnh đó GDSC HCMUT chúng mình vẫn còn có
																	những sự kiện, trò chơi cho vòng chung
																	kết:</span
																>
															</p>
															<ul
																style="
																	margin-top: 0px;
																	margin-bottom: 0px;
																	padding-inline-start: 48px;
																">
																<li
																	dir="ltr"
																	style="
																		list-style-type: disc;
																		font-size: 12pt;
																		font-family: Arial;
																		color: rgb(0, 0, 0);
																		background-color: transparent;
																		font-weight: 400;
																		font-style: normal;
																		font-variant: normal;
																		text-decoration: none;
																	">
																	<p
																		dir="ltr"
																		style="
																			line-height: 1.872;
																			background-color: rgb(255, 255, 255);
																			margin-top: 0pt;
																			margin-bottom: 0pt;
																		"
																		role="presentation">
																		<span
																			style="
																				font-size: 12pt;
																				font-family: Arial;
																				color: rgb(0, 0, 0);
																				background-color: transparent;
																				font-weight: 400;
																				font-style: normal;
																				font-variant: normal;
																				text-decoration: none;
																			"
																			>Ngày 25/06: </span
																		><span
																			style="
																				font-size: 12pt;
																				font-family: Arial;
																				color: rgb(0, 0, 0);
																				background-color: transparent;
																				font-weight: 700;
																				font-style: normal;
																				font-variant: normal;
																				text-decoration: none;
																			"
																			>GIC Idea Showcase</span
																		><span
																			style="
																				font-size: 12pt;
																				font-family: Arial;
																				color: rgb(0, 0, 0);
																				background-color: transparent;
																				font-weight: 400;
																				font-style: normal;
																				font-variant: normal;
																				text-decoration: none;
																			">
																		</span
																		><span
																			style="
																				font-size: 12pt;
																				font-family: Arial;
																				color: rgb(0, 0, 0);
																				background-color: transparent;
																				font-weight: 700;
																				font-style: normal;
																				font-variant: normal;
																				text-decoration: none;
																			"
																			>(Offline 08:00 - 12:30 Nhà văn hóa sinh
																			viên Đại học Quốc gia)</span
																		><span
																			style="
																				font-size: 12pt;
																				font-family: Arial;
																				color: rgb(0, 0, 0);
																				background-color: transparent;
																				font-weight: 400;
																				font-style: normal;
																				font-variant: normal;
																				text-decoration: none;
																			"
																			>. 6 đội được bình chọn đó sẽ trình bày ý
																			tưởng sau đó các khán giả và giám khảo sẽ
																			bình chọn cho đội thắng cuộc. Các bạn vẫn
																			có thể đăng kí trực tiếp tại </span
																		><span
																			style="
																				font-size: 12pt;
																				font-family: Arial;
																				color: rgb(0, 0, 0);
																				background-color: transparent;
																				font-weight: 700;
																				font-style: normal;
																				font-variant: normal;
																				text-decoration: none;
																			"
																			>[Link].</span
																		>
																	</p>
																</li>
																<li
																	dir="ltr"
																	style="
																		list-style-type: disc;
																		font-size: 12pt;
																		font-family: Arial;
																		color: rgb(0, 0, 0);
																		background-color: transparent;
																		font-weight: 400;
																		font-style: normal;
																		font-variant: normal;
																		text-decoration: none;
																	">
																	<p
																		dir="ltr"
																		style="
																			line-height: 1.872;
																			background-color: rgb(255, 255, 255);
																			margin-top: 0pt;
																			margin-bottom: 10pt;
																		"
																		role="presentation">
																		<span
																			style="
																				font-size: 12pt;
																				font-family: Arial;
																				color: rgb(0, 0, 0);
																				background-color: transparent;
																				font-weight: 700;
																				font-style: normal;
																				font-variant: normal;
																				text-decoration: none;
																			"
																			>[GDSC game name] </span
																		><span
																			style="
																				font-size: 12pt;
																				font-family: Arial;
																				color: rgb(0, 0, 0);
																				background-color: transparent;
																				font-weight: 400;
																				font-style: normal;
																				font-variant: normal;
																				text-decoration: none;
																			"
																			>tại </span
																		><span
																			style="
																				font-size: 12pt;
																				font-family: Arial;
																				color: rgb(0, 0, 0);
																				background-color: transparent;
																				font-weight: 700;
																				font-style: normal;
																				font-variant: normal;
																				text-decoration: none;
																			"
																			>[Link]</span
																		><span
																			style="
																				font-size: 12pt;
																				font-family: Arial;
																				color: rgb(0, 0, 0);
																				background-color: transparent;
																				font-weight: 400;
																				font-style: normal;
																				font-variant: normal;
																				text-decoration: none;
																			"
																			>. Một trò chơi giúp bạn kiếm những mảnh
																			ghép để tạo nên những phần quà </span
																		><span
																			style="
																				font-size: 12pt;
																				font-family: Arial;
																				color: rgb(0, 0, 0);
																				background-color: transparent;
																				font-weight: 700;
																				font-style: normal;
																				font-variant: normal;
																				text-decoration: none;
																			"
																			>thú vị và là giới hạn</span
																		><span
																			style="
																				font-size: 12pt;
																				font-family: Arial;
																				color: rgb(0, 0, 0);
																				background-color: transparent;
																				font-weight: 400;
																				font-style: normal;
																				font-variant: normal;
																				text-decoration: none;
																			">
																			tại website của chúng mình </span
																		><span
																			style="
																				font-size: 12pt;
																				font-family: Arial;
																				color: rgb(74, 134, 232);
																				background-color: transparent;
																				font-weight: 700;
																				font-style: normal;
																				font-variant: normal;
																				text-decoration: none;
																			"
																			>game.gdsc.app.</span
																		>
																	</p>
																</li>
															</ul>
															<p
																dir="ltr"
																style="
																	line-height: 1.872;
																	background-color: rgb(255, 255, 255);
																	margin-top: 0pt;
																	margin-bottom: 0pt;
																	padding: 0pt 0pt 10pt;
																">
																<span
																	style="
																		font-size: 12pt;
																		font-family: Arial;
																		color: rgb(0, 0, 0);
																		background-color: transparent;
																		font-weight: 400;
																		font-style: normal;
																		font-variant: normal;
																		text-decoration: none;
																	"
																	>GDSC - HCMUT rất vui khi có sự tham gia của
																	bạn, sự hiện diện và đóng góp của bạn sẽ là sự
																	thành công của sự kiện</span
																>
															</p>
															<p
																dir="ltr"
																style="
																	line-height: 1.872;
																	background-color: rgb(255, 255, 255);
																	margin-top: 0pt;
																	margin-bottom: 0pt;
																	padding: 0pt 0pt 10pt;
																">
																<span
																	style="
																		font-size: 12pt;
																		font-family: Arial;
																		color: rgb(0, 0, 0);
																		background-color: transparent;
																		font-weight: 400;
																		font-style: normal;
																		font-variant: normal;
																		text-decoration: none;
																	"
																	>Hẹn gặp bạn ở các sự kiện sắp tới.</span
																>
															</p>
															<p
																dir="ltr"
																style="
																	line-height: 1.656;
																	background-color: rgb(255, 255, 255);
																	margin-top: 0pt;
																	margin-bottom: 0pt;
																">
																<span
																	style="
																		font-size: 12pt;
																		font-family: Arial;
																		color: rgb(0, 0, 0);
																		background-color: transparent;
																		font-weight: 400;
																		font-style: normal;
																		font-variant: normal;
																		text-decoration: none;
																	"
																	>Cảm ơn./.</span
																>
															</p>
															<span
																id="m_-5174430959820603938m_8590484024401273439gmail-docs-internal-guid-0ee68f09-7fff-5ec6-0994-89a7bbb6040e"
																><p
																	dir="ltr"
																	style="
																		line-height: 1.38;
																		text-align: justify;
																		margin-top: 10pt;
																		margin-bottom: 0pt;
																	">
																	<span
																		style="
																			font-family: Arial;
																			background-color: transparent;
																			font-weight: 700;
																			font-variant-numeric: normal;
																			font-variant-east-asian: normal;
																			font-variant-alternates: normal;
																		"
																		><font color="#000000">--</font></span
																	>
																</p>
																<p
																	dir="ltr"
																	style="
																		line-height: 1.38;
																		text-align: justify;
																		margin-top: 10pt;
																		margin-bottom: 0pt;
																	">
																	<span
																		style="
																			font-size: 13pt;
																			font-family: Arial;
																			color: rgb(66, 133, 244);
																			background-color: transparent;
																			font-weight: 700;
																			font-variant-numeric: normal;
																			font-variant-east-asian: normal;
																			font-variant-alternates: normal;
																		"
																		>Google Developer Student Club</span
																	><span
																		style="
																			font-size: 13pt;
																			font-family: Arial;
																			color: rgb(66, 133, 244);
																			background-color: transparent;
																			font-weight: 700;
																			font-variant-numeric: normal;
																			font-variant-east-asian: normal;
																			font-variant-alternates: normal;
																		"
																		><br /></span
																	><span
																		style="
																			font-size: 11pt;
																			font-family: Arial;
																			color: rgb(85, 85, 85);
																			background-color: transparent;
																			font-variant-numeric: normal;
																			font-variant-east-asian: normal;
																			font-variant-alternates: normal;
																		"
																		>Ho Chi Minh City University of
																		Technology</span
																	>
																</p>
																<p
																	dir="ltr"
																	style="
																		line-height: 1.38;
																		text-align: justify;
																		margin-top: 0pt;
																		margin-bottom: 0pt;
																		padding: 10pt 0pt 0pt;
																	">
																	<span
																		style="
																			font-size: 10pt;
																			font-family: Arial;
																			color: rgb(85, 85, 85);
																			background-color: transparent;
																			font-weight: 700;
																			font-style: italic;
																			font-variant-numeric: normal;
																			font-variant-east-asian: normal;
																			font-variant-alternates: normal;
																		"
																		>Email: </span
																	><a
																		href="mailto:contact@gdschcmut.dev"
																		style="text-decoration-line: none"
																		target="_blank"
																		><span
																			style="
																				font-size: 10pt;
																				font-family: Arial;
																				background-color: transparent;
																				font-style: italic;
																				font-variant-numeric: normal;
																				font-variant-east-asian: normal;
																				font-variant-alternates: normal;
																				text-decoration-line: underline;
																			"
																			>contact@gdschcmut.dev</span
																		><span
																			style="
																				font-size: 10pt;
																				font-family: Arial;
																				color: rgb(66, 133, 244);
																				background-color: transparent;
																				font-style: italic;
																				font-variant-numeric: normal;
																				font-variant-east-asian: normal;
																				font-variant-alternates: normal;
																			"
																			><br /></span></a
																	><span
																		style="
																			font-size: 10pt;
																			font-family: Arial;
																			color: rgb(85, 85, 85);
																			background-color: transparent;
																			font-weight: 700;
																			font-style: italic;
																			font-variant-numeric: normal;
																			font-variant-east-asian: normal;
																			font-variant-alternates: normal;
																		"
																		>Facebook:</span
																	><a
																		href="https://www.facebook.com/dscxhcmut/"
																		style="text-decoration-line: none"
																		target="_blank"
																		data-saferedirecturl="https://www.google.com/url?q=https://www.facebook.com/dscxhcmut/&amp;source=gmail&amp;ust=1684859221061000&amp;usg=AOvVaw0xUt1dK6QXnipIuHMs_AoL"
																		><span
																			style="
																				font-size: 10pt;
																				font-family: Arial;
																				background-color: transparent;
																				font-weight: 700;
																				font-style: italic;
																				font-variant-numeric: normal;
																				font-variant-east-asian: normal;
																				font-variant-alternates: normal;
																				text-decoration-line: underline;
																			">
																		</span
																		><span
																			style="
																				font-size: 10pt;
																				font-family: Arial;
																				background-color: transparent;
																				font-style: italic;
																				font-variant-numeric: normal;
																				font-variant-east-asian: normal;
																				font-variant-alternates: normal;
																				text-decoration-line: underline;
																			"
																			>https://www.facebook.com/<wbr />dscxhcmut/</span
																		><span
																			style="
																				font-size: 10pt;
																				font-family: Arial;
																				color: rgb(85, 85, 85);
																				background-color: transparent;
																				font-weight: 700;
																				font-style: italic;
																				font-variant-numeric: normal;
																				font-variant-east-asian: normal;
																				font-variant-alternates: normal;
																			"
																			><br /></span></a
																	><span
																		style="
																			font-size: 10pt;
																			font-family: Arial;
																			color: rgb(85, 85, 85);
																			background-color: transparent;
																			font-weight: 700;
																			font-style: italic;
																			font-variant-numeric: normal;
																			font-variant-east-asian: normal;
																			font-variant-alternates: normal;
																		"
																		>Address:</span
																	><span
																		style="
																			font-size: 10pt;
																			font-family: Arial;
																			color: rgb(85, 85, 85);
																			background-color: transparent;
																			font-style: italic;
																			font-variant-numeric: normal;
																			font-variant-east-asian: normal;
																			font-variant-alternates: normal;
																		">
																		268 Ly Thuong Kiet, Ward 14, District 10, Ho
																		Chi Minh City</span
																	>
																</p></span
															></span
														>
														<table
															cellspacing="0"
															cellpadding="0"
															border="0"
															width="100%">
															<tbody></tbody>
														</table>
													</td>
												</tr>
											</tbody>
										</table>
									</td>
								</tr>

								<tr>
									<td>
										<table
											cellspacing="0"
											cellpadding="0"
											border="0"
											width="100%">
											<tbody>
												<tr>
													<td
														style="
															background-color: #ffffff;
															border-top: 1px solid #f6f7f9;
															padding: 40px 0 40px;
															font-size: 13px;
															color: #7e8890;
														"
														align="center">
														<a
															href="https://streaklinks.com/BT8hHi6ERIjsu_ZJEAk4wpeN/https%3A%2F%2Fu16161593.ct.sendgrid.net%2Fls%2Fclick%3Fupn%3D6FylDzOsBjandYrle4FqVZSdv3-2BbZ0ATs1aFPrX0Lwzg9C4VAJP20noOG84jTS0macmi_J2sXdVe2BnhqC3exzESXAmJMuMzjG71v7RSUsMbKve6Ib29LkCTGRRHZ0UZx9utclyf2jsJXHRWfDwAkctFUwX73MYpmhWoeW8oW3o4G-2BckDWo-2B-2BpTWXVDLrSObETzmtUBODjGL1bz38mFGTyffJb25DGpaEGIiPTR7dq560VdIXaKAEBLq9sVl1-2B-2BRDKL4D0J2OAJTTFSYIs07rHvbIHw-3D-3D"
															target="_blank"
															data-saferedirecturl="https://www.google.com/url?q=https://streaklinks.com/BT8hHi6ERIjsu_ZJEAk4wpeN/https%253A%252F%252Fu16161593.ct.sendgrid.net%252Fls%252Fclick%253Fupn%253D6FylDzOsBjandYrle4FqVZSdv3-2BbZ0ATs1aFPrX0Lwzg9C4VAJP20noOG84jTS0macmi_J2sXdVe2BnhqC3exzESXAmJMuMzjG71v7RSUsMbKve6Ib29LkCTGRRHZ0UZx9utclyf2jsJXHRWfDwAkctFUwX73MYpmhWoeW8oW3o4G-2BckDWo-2B-2BpTWXVDLrSObETzmtUBODjGL1bz38mFGTyffJb25DGpaEGIiPTR7dq560VdIXaKAEBLq9sVl1-2B-2BRDKL4D0J2OAJTTFSYIs07rHvbIHw-3D-3D&amp;source=gmail&amp;ust=1684859221061000&amp;usg=AOvVaw0IUWachcinSYOeJ36YJ2tp"
															><img
																border="0"
																src="https://ci3.googleusercontent.com/proxy/1r-2vzVLcsXOpbFMuS1z_1wAHilkgE7VFmSK2du-iSEE9y_IDtifkp_7W6Tl0I8cWPm-LpQkJJjwV-MWuUOCR9f8ODWCK6t1yzb40sb10EICj67F2A3ZaCIPBmtk9CdzZCBQ65LpsCExriQv8CzuM_4vxPC8UCV_Q6zlmJ5gj3hTZ7ObfIF2nkBXNKBsxB_o8mlvE0HvKyviDRH3jOdMhZUE6f84W3J0mPP3uMuxWfT3vmV9IRKqPAQoC5WlegZTQnruwsQq3A=s0-d-e1-ft#https://res.cloudinary.com/startup-grind/image/upload/c_fit,dpr_2.0,f_auto,g_center,h_60,q_auto:good,w_500/v1/gcs/platform-data-dsc/contentbuilder/logo_dark_horizontal_WVttpzD.png"
																height="30"
														/></a>
													</td>
												</tr>
											</tbody>
										</table>
									</td>
								</tr>
							</tbody>
						</table>
					</td>
				</tr>
			</tbody>
		</table>

		<img
			style="
				height: 1px !important;
				width: 1px !important;
				border-width: 0 !important;
				margin-top: 0 !important;
				margin-bottom: 0 !important;
				margin-right: 0 !important;
				margin-left: 0 !important;
				padding-top: 0 !important;
				padding-bottom: 0 !important;
				padding-right: 0 !important;
				padding-left: 0 !important;
			"
			border="0"
			height="1"
			width="1"
			alt=""
			src="https://ci5.googleusercontent.com/proxy/TM6Pu1jLMfEZO_Tw9fwBSCQg-_Pi4GoWDRH35_cS3oyS5zEJY192JqakvAo1DhL-as5PJ4a6vXaGyc_RBmzAEefu_kEfQ-XVEkQdQyj7H1VrlFa69UU1OjU3_Nq59DjkomUOP8_HQ97JUvlJbMESxO44jsyhXKtDA5jqHp8nRcpNnT1B131kO5lyHPulNQAstGE4pzXGdMBFepwi7Ad_axpSVr6y0jKa1xQzBHoVFIAnSsT0hMIpgUdty2J68SHBvBw9vjZHvbqMNTIaVYPTEHITn5lzsWxlDmXnw3eRc7VG14OFYq_Yijz686eSRqmntwBjI-247ST5KR8mD3v1d0xvJEWIgzCDz3ulJCHPYJaYu3TTRcKeyak4C856HHnEaC3RSa0iRt0UgUUz7zGVufO6bzg8yMqiS5I=s0-d-e1-ft#https://u16161593.ct.sendgrid.net/wf/open?upn=f9BVIBTE4MV61d5WjyC1xRBeR2D0-2FN201XFXTlyGhGyQgyHSETzPOsJgbL-2B6iWKcS5VFV0WSwLBEXJd1jcrJJuKwQm68GVMxsvpPG6KQ1MJzOJFj03Z-2FRqTFChIYweOcYW9QeGejF3u-2F9B11dZqzfjxleppWee-2FQ7IDcefEpxjuVE12hEsfPoZJNwF1utRzsCPvDW4FPYrxy3On5PFdlWE7kzdkn5ZSFwW1Pu2CyJj4-3D" />
	</div>
	<br />
</div>
    `
}

export function DAY_5_REGISTRATION_SUCCESSFUL_EMAIL(
    receiver: string,
    idForQR: Types.ObjectId
) {
    return `
    <div dir="ltr">
	<div
		style="
			background-color: #f6f7f9;
			margin: 0;
			padding: 0;
			font-family: 'Open Sans', Arial, sans-serif !important;
			font-weight: 400;
			color: #202124;
		">
		<div></div>
		<table cellpadding="15" cellspacing="0" border="0" width="100%">
			<tbody>
				<tr>
					<td style="background-color: #f6f7f9" align="center" width="100%">
						<table
							style="
								border-bottom-left-radius: 4px;
								border-bottom-right-radius: 4px;
								overflow: hidden;
								min-width: 290px;
								max-width: 600px;
							"
							cellspacing="0"
							cellpadding="0"
							border="0">
							<tbody>
								<tr>
									<td>
										<table
											cellspacing="0"
											cellpadding="0"
											border="0"
											width="100%">
											<tbody>
												<tr>
													<td
														style="
															padding: 0 0 15px;
															font-family: 'Open Sans', Arial, sans-serif !important;
														"
														valign="middle">
														<a
															style="
																font-size: 12px;
																color: #6f6f6f !important;
																padding: 1px 0;
																text-decoration: none !important;
															"
															href="https://streaklinks.com/BT8hHi6i4sz87Zu_jgWlHBim/https%3A%2F%2Fu16161593.ct.sendgrid.net%2Fls%2Fclick%3Fupn%3D6FylDzOsBjandYrle4FqVZSdv3-2BbZ0ATs1aFPrX0LwznXXv5-2BoPgUHFt4ZMWenhtzqm7TjwMiA-2FFAAcTgMmUzqjVEhGztoc3RXmIWr31f9U-3DI0CU_J2sXdVe2BnhqC3exzESXAmJMuMzjG71v7RSUsMbKve6Ib29LkCTGRRHZ0UZx9utc0IXBPSuXDsulPt-2BMuYAqYyOAd83zZixxdWawNN-2BT-2BiEAS7-2Bs49aOD3vNf7i12oczTvTKAg7vnxumi6yz7-2BrLhBQeoo95o72ChUsisLrcxpHCbTdj3-2Fpf0KoNR-2B9tXM6uj3lrwEddbE5MTql81MA0wQ-3D-3D"
															target="_blank"
															data-saferedirecturl="https://www.google.com/url?q=https://streaklinks.com/BT8hHi6i4sz87Zu_jgWlHBim/https%253A%252F%252Fu16161593.ct.sendgrid.net%252Fls%252Fclick%253Fupn%253D6FylDzOsBjandYrle4FqVZSdv3-2BbZ0ATs1aFPrX0LwznXXv5-2BoPgUHFt4ZMWenhtzqm7TjwMiA-2FFAAcTgMmUzqjVEhGztoc3RXmIWr31f9U-3DI0CU_J2sXdVe2BnhqC3exzESXAmJMuMzjG71v7RSUsMbKve6Ib29LkCTGRRHZ0UZx9utc0IXBPSuXDsulPt-2BMuYAqYyOAd83zZixxdWawNN-2BT-2BiEAS7-2Bs49aOD3vNf7i12oczTvTKAg7vnxumi6yz7-2BrLhBQeoo95o72ChUsisLrcxpHCbTdj3-2Fpf0KoNR-2B9tXM6uj3lrwEddbE5MTql81MA0wQ-3D-3D&amp;source=gmail&amp;ust=1684909879752000&amp;usg=AOvVaw2UUluje9Nfe3temLs2LC9I">
															Google Developer Student Clubs - VNU HCM -
															University of Technology
														</a>
													</td>

													<td
														style="
															padding: 0 0 15px;
															font-family: 'Open Sans', Arial, sans-serif !important;
														"
														valign="middle"
														align="right">
														<br />
													</td>
												</tr>
											</tbody>
										</table>
									</td>
								</tr>

								<tr>
									<td
										style="
											width: 600px;
											height: 136px;
											vertical-align: middle;
											border-bottom: 0px solid #f6f7f9;
											background-image: url(https://ci3.googleusercontent.com/proxy/jTbSl0_Srn4p-vihHLXnamvPIRqeZxUV8BUKAc3K9e9SGOUfkrvcSD4lXc-hrT8Xy6TJTpGAoO1_1YQhcYJhuyEUTFyhmZKHILgw709SiBMN2jTydWgf-PLxJc7UJrg8BTjB7aVfi1k1LjsoJov1dIrrxeNjzDGWSWctWk0mu2U2Ob7UM1QWU8BrNTkvaA8PdcQqyhXjlHU-J7n3k5vcCTHI6QZno8Eei93sXQGLfNiw_9nWGxWmgA=s0-d-e1-ft#https://res.cloudinary.com/startup-grind/image/upload/c_fill,dpr_2.0,f_auto,g_center,h_135,q_auto:eco,w_600/v1/gcs/platform-data-dsc/contentbuilder/email_header.png);
											background-color: #fff;
											border-top-right-radius: 4px;
											border-top-left-radius: 4px;
											background-size: cover;
										">
										<table
											style="width: 100%"
											width="100%"
											cellspacing="20"
											cellpadding="0"
											border="0">
											<tbody>
												<tr>
													<td
														style="vertical-align: middle; text-align: center">
														<div style="display: inline-block">
															<a
																style="text-align: center; display: block"
																href="https://streaklinks.com/BT8hHi6PT1YYETjglwM_Hm9E/https%3A%2F%2Fu16161593.ct.sendgrid.net%2Fls%2Fclick%3Fupn%3D6FylDzOsBjandYrle4FqVZSdv3-2BbZ0ATs1aFPrX0LwznXXv5-2BoPgUHFt4ZMWenhtzqm7TjwMiA-2FFAAcTgMmUzqjVEhGztoc3RXmIWr31f9U-3D1WWW_J2sXdVe2BnhqC3exzESXAmJMuMzjG71v7RSUsMbKve6Ib29LkCTGRRHZ0UZx9utcOdQF6JS3ei-2Fi-2B544Dvf86oqppqJ8ierQQhGgjkxucq7fumdIZnstg-2BFUndpO-2FfxP4Ly3TP4GzCOy9ht90I8WESMt6kPH7KOOCcKJJqWM79bCah4CxTulb6AN7wK5cJ2S-2FdFuFhMq1xCBL1vObinRiQ-3D-3D"
																target="_blank"
																data-saferedirecturl="https://www.google.com/url?q=https://streaklinks.com/BT8hHi6PT1YYETjglwM_Hm9E/https%253A%252F%252Fu16161593.ct.sendgrid.net%252Fls%252Fclick%253Fupn%253D6FylDzOsBjandYrle4FqVZSdv3-2BbZ0ATs1aFPrX0LwznXXv5-2BoPgUHFt4ZMWenhtzqm7TjwMiA-2FFAAcTgMmUzqjVEhGztoc3RXmIWr31f9U-3D1WWW_J2sXdVe2BnhqC3exzESXAmJMuMzjG71v7RSUsMbKve6Ib29LkCTGRRHZ0UZx9utcOdQF6JS3ei-2Fi-2B544Dvf86oqppqJ8ierQQhGgjkxucq7fumdIZnstg-2BFUndpO-2FfxP4Ly3TP4GzCOy9ht90I8WESMt6kPH7KOOCcKJJqWM79bCah4CxTulb6AN7wK5cJ2S-2FdFuFhMq1xCBL1vObinRiQ-3D-3D&amp;source=gmail&amp;ust=1684909879752000&amp;usg=AOvVaw31igyJh6zL58G1hNeKh0Xn">
																<img
																	height="50"
																	border="0"
																	alt="Google Developer Student Clubs"
																	src="https://ci3.googleusercontent.com/proxy/wEsj66QGvdQacrMw4Qm3A1r-Gbyd3Uz7XY2HRkhxyXCxKpzCzuqi2KlBu70FVmRXCvpd7HqgnKJFFW2ga4xiGnLgF1jjWDvQfTAgMBbC_onFujTrhFAl99zrDBLsS6moSRMG2EAHgFGRL2dLMbG-0GkgcVd3pOEeeTJzZzhI6CuspG6FeRi177hNC7sRe2INLGkoVoVMrgzZhPiZs4HnGot13yae4p1VnyKpydIqCwul8OV7wDdlCBT8EQ9K6HTlNVMM49A=s0-d-e1-ft#https://res.cloudinary.com/startup-grind/image/upload/c_fit,dpr_2.0,f_auto,g_center,h_100,q_auto:good,w_500/v1/gcs/platform-data-dsc/contentbuilder/logo_dark_stacked_ziDh4mP.png" />
															</a>
														</div>
													</td>
												</tr>
											</tbody>
										</table>
									</td>
								</tr>

								<tr>
									<td style="padding-top: 1px">
										<table
											cellspacing="0"
											cellpadding="0"
											border="0"
											width="100%">
											<tbody>
												<tr>
													<td
														style="
															background-color: #fff;
															padding: 25px 35px;
															text-align: left;
															font-family: 'Open Sans', Arial, sans-serif !important;
															font-size: 14px;
															line-height: 20px;
														"
														align="center"
														valign="top">
														<span
															id="m_4752688072872031428m_-5174430959820603938m_8590484024401273439m_-7246610426249120709gmail-docs-internal-guid-1795923a-7fff-3ee5-47f8-07a4555c096e"
															><p
																dir="ltr"
																style="
																	line-height: 1.656;
																	background-color: rgb(255, 255, 255);
																	margin-top: 0pt;
																	margin-bottom: 0pt;
																	padding: 0pt 0pt 10pt;
																">
																<span
																	style="
																		font-size: 12pt;
																		font-family: Arial;
																		color: rgb(0, 0, 0);
																		background-color: transparent;
																		font-weight: 400;
																		font-style: normal;
																		font-variant: normal;
																		text-decoration: none;
																	"
																	>Xin chào </span
																><span
																	style="
																		font-size: 12pt;
																		font-family: Arial;
																		color: rgb(0, 0, 0);
																		background-color: transparent;
																		font-weight: 700;
																		font-style: normal;
																		font-variant: normal;
																		text-decoration: none;
																	"
																	>${receiver}</span
																><span
																	style="
																		font-size: 12pt;
																		font-family: Arial;
																		color: rgb(0, 0, 0);
																		background-color: transparent;
																		font-weight: 400;
																		font-style: normal;
																		font-variant: normal;
																		text-decoration: none;
																	"
																	>,</span
																>
															</p>
															<p
																dir="ltr"
																style="
																	line-height: 1.872;
																	background-color: rgb(255, 255, 255);
																	margin-top: 0pt;
																	margin-bottom: 0pt;
																	padding: 0pt 0pt 10pt;
																">
																<span
																	style="
																		font-size: 12pt;
																		font-family: Arial;
																		color: rgb(0, 0, 0);
																		background-color: transparent;
																		font-weight: 400;
																		font-style: normal;
																		font-variant: normal;
																		text-decoration: none;
																	"
																	>Chúc mừng </span
																><span
																	style="
																		font-size: 12pt;
																		font-family: Arial;
																		color: rgb(0, 0, 0);
																		background-color: transparent;
																		font-weight: 700;
																		font-style: normal;
																		font-variant: normal;
																		text-decoration: none;
																	"
																	>${receiver}</span
																><span
																	style="
																		font-size: 12pt;
																		font-family: Arial;
																		color: rgb(0, 0, 0);
																		background-color: transparent;
																		font-weight: 400;
																		font-style: normal;
																		font-variant: normal;
																		text-decoration: none;
																	">
																	đã đăng ký thành công và trở thành một phần
																	của của sự kiện buổi chung kết </span
																><span
																	style="
																		font-size: 12pt;
																		font-family: Arial;
																		color: rgb(0, 0, 0);
																		background-color: transparent;
																		font-weight: 700;
																		font-style: normal;
																		font-variant: normal;
																		text-decoration: none;
																	"
																	>GIC Idea Showcase </span
																><span
																	style="
																		font-size: 12pt;
																		font-family: Arial;
																		color: rgb(0, 0, 0);
																		background-color: transparent;
																		font-weight: 400;
																		font-style: normal;
																		font-variant: normal;
																		text-decoration: none;
																	"
																	>trong chuỗi </span
																><span
																	style="
																		font-size: 12pt;
																		font-family: Arial;
																		color: rgb(0, 0, 0);
																		background-color: transparent;
																		font-weight: 700;
																		font-style: normal;
																		font-variant: normal;
																		text-decoration: none;
																	"
																	>GDSC Idea Contest: THiNK 2023</span
																><span
																	style="
																		font-size: 12pt;
																		font-family: Arial;
																		color: rgb(0, 0, 0);
																		background-color: transparent;
																		font-weight: 400;
																		font-style: normal;
																		font-variant: normal;
																		text-decoration: none;
																	"
																	>. Đây sẽ là mã QR dùng để check in tại sự
																	kiện cũng như là để bình chọn cho các đội tham
																	gia buổi chung kết.</span
																>
															</p>
															<div
																style="
																	display: flex;
																	justify-content: center;
																	margin-bottom: 10pt;
																">
																<img
																	src="https://dev.api.fessior.com/gic/qr/${idForQR.toString()}"
																	style="width: 40%" />
															</div>
															<p
																dir="ltr"
																style="
																	line-height: 1.872;
																	background-color: rgb(255, 255, 255);
																	margin-top: 0pt;
																	margin-bottom: 0pt;
																">
																<span
																	style="
																		font-size: 12pt;
																		font-family: Arial;
																		color: rgb(0, 0, 0);
																		background-color: transparent;
																		font-weight: 700;
																		font-style: normal;
																		font-variant: normal;
																		text-decoration: none;
																	"
																	>GIC Idea Showcase</span
																><span
																	style="
																		font-size: 12pt;
																		font-family: Arial;
																		color: rgb(0, 0, 0);
																		background-color: transparent;
																		font-weight: 400;
																		font-style: normal;
																		font-variant: normal;
																		text-decoration: none;
																	">
																	giờ đây sẽ thêm thú vị hơn bởi có sự xuất hiện
																	bạn. Đừng quên những thông tin của ngày đặc
																	biệt này nhé:</span
																>
															</p>
															<ul
																style="
																	margin-top: 0px;
																	margin-bottom: 0px;
																	padding-inline-start: 48px;
																">
																<li
																	dir="ltr"
																	style="
																		list-style-type: disc;
																		font-size: 12pt;
																		font-family: Arial;
																		color: rgb(0, 0, 0);
																		background-color: transparent;
																		font-weight: 400;
																		font-style: normal;
																		font-variant: normal;
																		text-decoration: none;
																	">
																	<p
																		dir="ltr"
																		style="
																			line-height: 1.872;
																			background-color: rgb(255, 255, 255);
																			margin-top: 0pt;
																			margin-bottom: 0pt;
																		"
																		role="presentation">
																		<span
																			style="
																				font-size: 12pt;
																				font-family: Arial;
																				color: rgb(0, 0, 0);
																				background-color: transparent;
																				font-weight: 400;
																				font-style: normal;
																				font-variant: normal;
																				text-decoration: none;
																			"
																			>Ngày 25/06: </span
																		><span
																			style="
																				font-size: 12pt;
																				font-family: Arial;
																				color: rgb(0, 0, 0);
																				background-color: transparent;
																				font-weight: 700;
																				font-style: normal;
																				font-variant: normal;
																				text-decoration: none;
																			"
																			>GIC Idea Showcase</span
																		><span
																			style="
																				font-size: 12pt;
																				font-family: Arial;
																				color: rgb(0, 0, 0);
																				background-color: transparent;
																				font-weight: 400;
																				font-style: normal;
																				font-variant: normal;
																				text-decoration: none;
																			">
																		</span
																		><span
																			style="
																				font-size: 12pt;
																				font-family: Arial;
																				color: rgb(0, 0, 0);
																				background-color: transparent;
																				font-weight: 700;
																				font-style: normal;
																				font-variant: normal;
																				text-decoration: none;
																			"
																			>(Offline 08:00 - 12:30 Nhà văn hóa sinh
																			viên Đại học Quốc gia)</span
																		><span
																			style="
																				font-size: 12pt;
																				font-family: Arial;
																				color: rgb(0, 0, 0);
																				background-color: transparent;
																				font-weight: 400;
																				font-style: normal;
																				font-variant: normal;
																				text-decoration: none;
																			"
																			>. 6 đội được bình chọn đó sẽ trình bày ý
																			tưởng sau đó các khán giả và giám khảo sẽ
																			bình chọn cho đội thắng cuộc.</span
																		>
																	</p>
																</li>
																<li
																	dir="ltr"
																	style="
																		list-style-type: disc;
																		font-size: 12pt;
																		font-family: Arial;
																		color: rgb(0, 0, 0);
																		background-color: transparent;
																		font-weight: 400;
																		font-style: normal;
																		font-variant: normal;
																		text-decoration: none;
																	">
																	<p
																		dir="ltr"
																		style="
																			line-height: 1.872;
																			background-color: rgb(255, 255, 255);
																			margin-top: 0pt;
																			margin-bottom: 10pt;
																		"
																		role="presentation">
																		<span
																			style="
																				font-size: 12pt;
																				font-family: Arial;
																				color: rgb(0, 0, 0);
																				background-color: transparent;
																				font-weight: 400;
																				font-style: normal;
																				font-variant: normal;
																				text-decoration: none;
																			"
																			>Khi tham dự ngày GIC Idea Showcase, các
																			diễn giả, chuyên gia và ban giám khảo sẽ
																			trả lời các câu hỏi về công nghệ, cơ hội
																			việc làm sẽ được giải đáp. Bên cạnh&nbsp;
																			đó là những đội thi, những ý tưởng sẽ được
																			trình bày và cách ban giám khảo chọn ra
																			đội thắng cuộc sẽ là một điều bất ngờ
																			đấy!</span
																		>
																	</p>
																</li>
															</ul>
															<p
																dir="ltr"
																style="
																	line-height: 1.872;
																	background-color: rgb(255, 255, 255);
																	margin-top: 0pt;
																	margin-bottom: 0pt;
																	padding: 0pt 0pt 10pt;
																">
																<span
																	style="
																		font-size: 12pt;
																		font-family: Arial;
																		color: rgb(0, 0, 0);
																		background-color: transparent;
																		font-weight: 400;
																		font-style: normal;
																		font-variant: normal;
																		text-decoration: none;
																	"
																	>Ngoài sự kiện ra, chúng mình còn có những trò
																	chơi để các bạn có thể tương tác với câu lạc
																	bộ GDSC HCMUT chúng mình tại </span
																><span
																	style="
																		font-size: 12pt;
																		font-family: Arial;
																		color: rgb(0, 0, 0);
																		background-color: transparent;
																		font-weight: 700;
																		font-style: normal;
																		font-variant: normal;
																		text-decoration: none;
																	"
																	>[GDSC game name]</span
																><span
																	style="
																		font-size: 12pt;
																		font-family: Arial;
																		color: rgb(0, 0, 0);
																		background-color: transparent;
																		font-weight: 400;
																		font-style: normal;
																		font-variant: normal;
																		text-decoration: none;
																	">
																	tại </span
																><span
																	style="
																		font-size: 12pt;
																		font-family: Arial;
																		color: rgb(0, 0, 0);
																		background-color: transparent;
																		font-weight: 700;
																		font-style: normal;
																		font-variant: normal;
																		text-decoration: none;
																	"
																	>[Link]</span
																><span
																	style="
																		font-size: 12pt;
																		font-family: Arial;
																		color: rgb(0, 0, 0);
																		background-color: transparent;
																		font-weight: 400;
																		font-style: normal;
																		font-variant: normal;
																		text-decoration: none;
																	"
																	>. Một trò chơi giúp bạn kiếm những mảnh ghép
																	để tạo nên những phần quà </span
																><span
																	style="
																		font-size: 12pt;
																		font-family: Arial;
																		color: rgb(0, 0, 0);
																		background-color: transparent;
																		font-weight: 700;
																		font-style: normal;
																		font-variant: normal;
																		text-decoration: none;
																	"
																	>thú vị và giới hạn</span
																><span
																	style="
																		font-size: 12pt;
																		font-family: Arial;
																		color: rgb(0, 0, 0);
																		background-color: transparent;
																		font-weight: 400;
																		font-style: normal;
																		font-variant: normal;
																		text-decoration: none;
																	">
																	tại website của chúng mình </span
																><span
																	style="
																		font-size: 12pt;
																		font-family: Arial;
																		color: rgb(74, 134, 232);
																		background-color: transparent;
																		font-weight: 700;
																		font-style: normal;
																		font-variant: normal;
																		text-decoration: none;
																	"
																	>game.gdsc.app.</span
																>
															</p>
															<p
																dir="ltr"
																style="
																	line-height: 1.872;
																	background-color: rgb(255, 255, 255);
																	margin-top: 0pt;
																	margin-bottom: 0pt;
																	padding: 0pt 0pt 10pt;
																">
																<span
																	style="
																		font-size: 12pt;
																		font-family: Arial;
																		color: rgb(0, 0, 0);
																		background-color: transparent;
																		font-weight: 400;
																		font-style: normal;
																		font-variant: normal;
																		text-decoration: none;
																	"
																	>GDSC - HCMUT rất vui khi có sự tham gia của
																	bạn, sự hiện diện và đóng góp của bạn&nbsp; sẽ
																	là sự thành công của sự kiện</span
																>
															</p>
															<p
																dir="ltr"
																style="
																	line-height: 1.872;
																	background-color: rgb(255, 255, 255);
																	margin-top: 0pt;
																	margin-bottom: 0pt;
																	padding: 0pt 0pt 10pt;
																">
																<span
																	style="
																		font-size: 12pt;
																		font-family: Arial;
																		color: rgb(0, 0, 0);
																		background-color: transparent;
																		font-weight: 400;
																		font-style: normal;
																		font-variant: normal;
																		text-decoration: none;
																	"
																	>Hẹn gặp bạn ở sự kiện sắp tới.</span
																>
															</p>
															<p
																dir="ltr"
																style="
																	line-height: 1.656;
																	background-color: rgb(255, 255, 255);
																	margin-top: 0pt;
																	margin-bottom: 0pt;
																">
																<span
																	style="
																		font-size: 12pt;
																		font-family: Arial;
																		color: rgb(0, 0, 0);
																		background-color: transparent;
																		font-weight: 400;
																		font-style: normal;
																		font-variant: normal;
																		text-decoration: none;
																	"
																	>Cảm ơn./.</span
																>
															</p>
															<span
																id="m_4752688072872031428m_-5174430959820603938m_8590484024401273439gmail-docs-internal-guid-0ee68f09-7fff-5ec6-0994-89a7bbb6040e"
																><p
																	dir="ltr"
																	style="
																		line-height: 1.38;
																		text-align: justify;
																		margin-top: 10pt;
																		margin-bottom: 0pt;
																	">
																	<span
																		style="
																			font-family: Arial;
																			background-color: transparent;
																			font-weight: 700;
																			font-variant-numeric: normal;
																			font-variant-east-asian: normal;
																			font-variant-alternates: normal;
																			vertical-align: baseline;
																			white-space: pre-wrap;
																		"
																		><font color="#000000">--</font></span
																	>
																</p>
																<p
																	dir="ltr"
																	style="
																		line-height: 1.38;
																		text-align: justify;
																		margin-top: 10pt;
																		margin-bottom: 0pt;
																	">
																	<span
																		style="
																			font-size: 13pt;
																			font-family: Arial;
																			color: rgb(66, 133, 244);
																			background-color: transparent;
																			font-weight: 700;
																			font-variant-numeric: normal;
																			font-variant-east-asian: normal;
																			font-variant-alternates: normal;
																			vertical-align: baseline;
																			white-space: pre-wrap;
																		"
																		>Google Developer Student Club</span
																	><span
																		style="
																			font-size: 13pt;
																			font-family: Arial;
																			color: rgb(66, 133, 244);
																			background-color: transparent;
																			font-weight: 700;
																			font-variant-numeric: normal;
																			font-variant-east-asian: normal;
																			font-variant-alternates: normal;
																			vertical-align: baseline;
																			white-space: pre-wrap;
																		"
																		><br /></span
																	><span
																		style="
																			font-size: 11pt;
																			font-family: Arial;
																			color: rgb(85, 85, 85);
																			background-color: transparent;
																			font-variant-numeric: normal;
																			font-variant-east-asian: normal;
																			font-variant-alternates: normal;
																			vertical-align: baseline;
																			white-space: pre-wrap;
																		"
																		>Ho Chi Minh City University of
																		Technology</span
																	>
																</p>
																<p
																	dir="ltr"
																	style="
																		line-height: 1.38;
																		text-align: justify;
																		margin-top: 0pt;
																		margin-bottom: 0pt;
																		padding: 10pt 0pt 0pt;
																	">
																	<span
																		style="
																			font-size: 10pt;
																			font-family: Arial;
																			color: rgb(85, 85, 85);
																			background-color: transparent;
																			font-weight: 700;
																			font-style: italic;
																			font-variant-numeric: normal;
																			font-variant-east-asian: normal;
																			font-variant-alternates: normal;
																			vertical-align: baseline;
																			white-space: pre-wrap;
																		"
																		>Email: </span
																	><a
																		href="mailto:contact@gdschcmut.dev"
																		style="text-decoration-line: none"
																		target="_blank"
																		><span
																			style="
																				font-size: 10pt;
																				font-family: Arial;
																				background-color: transparent;
																				font-style: italic;
																				font-variant-numeric: normal;
																				font-variant-east-asian: normal;
																				font-variant-alternates: normal;
																				text-decoration-line: underline;
																			"
																			>contact@gdschcmut.dev</span
																		><span
																			style="
																				font-size: 10pt;
																				font-family: Arial;
																				color: rgb(66, 133, 244);
																				background-color: transparent;
																				font-style: italic;
																				font-variant-numeric: normal;
																				font-variant-east-asian: normal;
																				font-variant-alternates: normal;
																			"
																			><br /></span></a
																	><span
																		style="
																			font-size: 10pt;
																			font-family: Arial;
																			color: rgb(85, 85, 85);
																			background-color: transparent;
																			font-weight: 700;
																			font-style: italic;
																			font-variant-numeric: normal;
																			font-variant-east-asian: normal;
																			font-variant-alternates: normal;
																			vertical-align: baseline;
																			white-space: pre-wrap;
																		"
																		>Facebook:</span
																	><a
																		href="https://www.facebook.com/dscxhcmut/"
																		style="text-decoration-line: none"
																		target="_blank"
																		data-saferedirecturl="https://www.google.com/url?q=https://www.facebook.com/dscxhcmut/&amp;source=gmail&amp;ust=1684909879753000&amp;usg=AOvVaw2lljddD7uB4uZA-uEjLICl"
																		><span
																			style="
																				font-size: 10pt;
																				font-family: Arial;
																				background-color: transparent;
																				font-weight: 700;
																				font-style: italic;
																				font-variant-numeric: normal;
																				font-variant-east-asian: normal;
																				font-variant-alternates: normal;
																				text-decoration-line: underline;
																			">
																		</span
																		><span
																			style="
																				font-size: 10pt;
																				font-family: Arial;
																				background-color: transparent;
																				font-style: italic;
																				font-variant-numeric: normal;
																				font-variant-east-asian: normal;
																				font-variant-alternates: normal;
																				text-decoration-line: underline;
																			"
																			>https://www.facebook.com/<wbr />dscxhcmut/</span
																		><span
																			style="
																				font-size: 10pt;
																				font-family: Arial;
																				color: rgb(85, 85, 85);
																				background-color: transparent;
																				font-weight: 700;
																				font-style: italic;
																				font-variant-numeric: normal;
																				font-variant-east-asian: normal;
																				font-variant-alternates: normal;
																			"
																			><br /></span></a
																	><span
																		style="
																			font-size: 10pt;
																			font-family: Arial;
																			color: rgb(85, 85, 85);
																			background-color: transparent;
																			font-weight: 700;
																			font-style: italic;
																			font-variant-numeric: normal;
																			font-variant-east-asian: normal;
																			font-variant-alternates: normal;
																			vertical-align: baseline;
																			white-space: pre-wrap;
																		"
																		>Address:</span
																	><span
																		style="
																			font-size: 10pt;
																			font-family: Arial;
																			color: rgb(85, 85, 85);
																			background-color: transparent;
																			font-style: italic;
																			font-variant-numeric: normal;
																			font-variant-east-asian: normal;
																			font-variant-alternates: normal;
																			vertical-align: baseline;
																			white-space: pre-wrap;
																		">
																		268 Ly Thuong Kiet, Ward 14, District 10, Ho
																		Chi Minh City</span
																	>
																</p></span
															></span
														>
														<table
															cellspacing="0"
															cellpadding="0"
															border="0"
															width="100%">
															<tbody></tbody>
														</table>
													</td>
												</tr>
											</tbody>
										</table>
									</td>
								</tr>

								<tr>
									<td>
										<table
											cellspacing="0"
											cellpadding="0"
											border="0"
											width="100%">
											<tbody>
												<tr>
													<td
														style="
															background-color: #ffffff;
															border-top: 1px solid #f6f7f9;
															padding: 40px 0 40px;
															font-size: 13px;
															color: #7e8890;
														"
														align="center">
														<a
															href="https://streaklinks.com/BT8hHi6ERIjsu_ZJEAk4wpeN/https%3A%2F%2Fu16161593.ct.sendgrid.net%2Fls%2Fclick%3Fupn%3D6FylDzOsBjandYrle4FqVZSdv3-2BbZ0ATs1aFPrX0Lwzg9C4VAJP20noOG84jTS0macmi_J2sXdVe2BnhqC3exzESXAmJMuMzjG71v7RSUsMbKve6Ib29LkCTGRRHZ0UZx9utclyf2jsJXHRWfDwAkctFUwX73MYpmhWoeW8oW3o4G-2BckDWo-2B-2BpTWXVDLrSObETzmtUBODjGL1bz38mFGTyffJb25DGpaEGIiPTR7dq560VdIXaKAEBLq9sVl1-2B-2BRDKL4D0J2OAJTTFSYIs07rHvbIHw-3D-3D"
															target="_blank"
															data-saferedirecturl="https://www.google.com/url?q=https://streaklinks.com/BT8hHi6ERIjsu_ZJEAk4wpeN/https%253A%252F%252Fu16161593.ct.sendgrid.net%252Fls%252Fclick%253Fupn%253D6FylDzOsBjandYrle4FqVZSdv3-2BbZ0ATs1aFPrX0Lwzg9C4VAJP20noOG84jTS0macmi_J2sXdVe2BnhqC3exzESXAmJMuMzjG71v7RSUsMbKve6Ib29LkCTGRRHZ0UZx9utclyf2jsJXHRWfDwAkctFUwX73MYpmhWoeW8oW3o4G-2BckDWo-2B-2BpTWXVDLrSObETzmtUBODjGL1bz38mFGTyffJb25DGpaEGIiPTR7dq560VdIXaKAEBLq9sVl1-2B-2BRDKL4D0J2OAJTTFSYIs07rHvbIHw-3D-3D&amp;source=gmail&amp;ust=1684909879753000&amp;usg=AOvVaw0C9sZuCWuk18S5FfVKYGHO"
															><img
																border="0"
																src="https://ci3.googleusercontent.com/proxy/1r-2vzVLcsXOpbFMuS1z_1wAHilkgE7VFmSK2du-iSEE9y_IDtifkp_7W6Tl0I8cWPm-LpQkJJjwV-MWuUOCR9f8ODWCK6t1yzb40sb10EICj67F2A3ZaCIPBmtk9CdzZCBQ65LpsCExriQv8CzuM_4vxPC8UCV_Q6zlmJ5gj3hTZ7ObfIF2nkBXNKBsxB_o8mlvE0HvKyviDRH3jOdMhZUE6f84W3J0mPP3uMuxWfT3vmV9IRKqPAQoC5WlegZTQnruwsQq3A=s0-d-e1-ft#https://res.cloudinary.com/startup-grind/image/upload/c_fit,dpr_2.0,f_auto,g_center,h_60,q_auto:good,w_500/v1/gcs/platform-data-dsc/contentbuilder/logo_dark_horizontal_WVttpzD.png"
																height="30"
														/></a>
													</td>
												</tr>
											</tbody>
										</table>
									</td>
								</tr>
							</tbody>
						</table>
					</td>
				</tr>
			</tbody>
		</table>

		<img
			style="
				height: 1px !important;
				width: 1px !important;
				border-width: 0 !important;
				margin-top: 0 !important;
				margin-bottom: 0 !important;
				margin-right: 0 !important;
				margin-left: 0 !important;
				padding-top: 0 !important;
				padding-bottom: 0 !important;
				padding-right: 0 !important;
				padding-left: 0 !important;
			"
			border="0"
			height="1"
			width="1"
			alt=""
			src="https://ci5.googleusercontent.com/proxy/TM6Pu1jLMfEZO_Tw9fwBSCQg-_Pi4GoWDRH35_cS3oyS5zEJY192JqakvAo1DhL-as5PJ4a6vXaGyc_RBmzAEefu_kEfQ-XVEkQdQyj7H1VrlFa69UU1OjU3_Nq59DjkomUOP8_HQ97JUvlJbMESxO44jsyhXKtDA5jqHp8nRcpNnT1B131kO5lyHPulNQAstGE4pzXGdMBFepwi7Ad_axpSVr6y0jKa1xQzBHoVFIAnSsT0hMIpgUdty2J68SHBvBw9vjZHvbqMNTIaVYPTEHITn5lzsWxlDmXnw3eRc7VG14OFYq_Yijz686eSRqmntwBjI-247ST5KR8mD3v1d0xvJEWIgzCDz3ulJCHPYJaYu3TTRcKeyak4C856HHnEaC3RSa0iRt0UgUUz7zGVufO6bzg8yMqiS5I=s0-d-e1-ft#https://u16161593.ct.sendgrid.net/wf/open?upn=f9BVIBTE4MV61d5WjyC1xRBeR2D0-2FN201XFXTlyGhGyQgyHSETzPOsJgbL-2B6iWKcS5VFV0WSwLBEXJd1jcrJJuKwQm68GVMxsvpPG6KQ1MJzOJFj03Z-2FRqTFChIYweOcYW9QeGejF3u-2F9B11dZqzfjxleppWee-2FQ7IDcefEpxjuVE12hEsfPoZJNwF1utRzsCPvDW4FPYrxy3On5PFdlWE7kzdkn5ZSFwW1Pu2CyJj4-3D" />
	</div>
	<br />
</div>
    `
}
