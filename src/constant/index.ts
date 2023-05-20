import { Address } from 'mailtrap';

export const OLD_RECIPIENTS: Address[] = [
    {
        email: 'duc.nv291@gmail.com',
    },
    {
        email: 'nguyetminh755@gmail.com',
    },
    {
        email: 'duc.nguyen291@hcmut.edu.vn',
    },
    {
        email: 'vietducvinamilk22222@gmail.com',
    },
    {
        email: 'lygioian@gmail.com',
    },
    {
        email: 'khoa.tranngocdang03@hcmut.edu.vn',
    },
    {
        email: 'truongquochung312@gmail.com',
    },
    {
        email: 'khoi.nguyentran2701@hcmut.edu.vn',
    },
    {
        email: 'minh.tranduy2209@hcmut.edu.vn',
    },
    {
        email: 'tonynghi81@gmail.com',
    },
    {
        email: 'khanhtrnguyen863@gmail.com',
    },
    {
        email: 'nhu1142002@gmail.com',
    },
    {
        email: 'anh.dinhcs20@hcmut.edu.vn',
    },
    {
        email: 'thuapi75@gmail.com',
    },
    {
        email: 'phankhai5004@gmail.com',
    },
    {
        email: 'tan.le612@hcmut.edu.vn',
    },
    {
        email: 'thuan.duong2003@hcmut.edu.vn',
    },
    {
        email: 'sang.nguyendeptroai@hcmut.edu.vn',
    },
    {
        email: 'khoa.trangtrong@hcmut.edu.vn',
    },
    {
        email: 'trinhanpham2801@gmail.com',
    },
    {
        email: 'nhan.tonhan0812@hcmut.edu.vn',
    },
];

export const NEW_RECIPIENTS: Address[] = [
    {
        email: 'duc.nv291@gmail.com',
    },
    {
        email: 'nguyetminh755@gmail.com',
    },
    {
        email: 'duc.nguyen291@hcmut.edu.vn',
    },
    {
        email: 'vietducvinamilk22222@gmail.com',
    },
    {
        email: 'hainam265@gmail.com',
    },
    {
        email: 'minhduytranct2017@gmail.com',
    },
    {
        email: 'tonynghi81@gmail.com',
    },
    {
        email: 'khanhtrnguyen863@gmail.com',
    },
    {
        email: 'nhu.huynh1142002@hcmut.edu.vn',
    },
    {
        email: 'thuapi75@gmail.com',
    },
    {
        email: 'phankhai5004@gmail.com',
    },
    {
        email: 'anhdinhlenhat@gmail.com',
    },
    {
        email: 'phanhuynhkhanhxuan@gmail.com',
    },
    {
        email: 'tuanminhtruong2004@gmail.com',
    },
    {
        email: 'lazydokb27@gmail.com',
    },
    {
        email: 'tdthuan5a1@gmail.com',
    },
    {
        email: 'sang.nguyendeptroai@hcmut.edu.vn',
    },
    {
        email: 'tan.le612@hcmut.edu.vn',
    },
    {
        email: 'honganh41139@gmail.com',
    },
    {
        email: 'giahoa1903@gmail.com',
    },
    {
        email: 'tiendat0417@gmail.com',
    },
    {
        email: 'trananhkhoitv@gmail.com',
    },
    {
        email: 'dhddrh09@gmail.com',
    },
    {
        email: 'nhan.tonhan0812@hcmut.edu.vn',
    },
    {
        email: 'lygioian@gmail.com',
    },
    {
        email: 'truongquochung312@gmail.com',
    },
    {
        email: 'daoanhphuc84@gmail.com',
    },
    {
        email: 'khoa.tranngocdang03@hcmut.edu.vn',
    },
    {
        email: 'khoi.nguyentran2701@hcmut.edu.vn',
    },
];

export const DUC_EMAILS: Address[] = [
    {
        email: 'duc.nv291@gmail.com',
    },
    {
        email: 'nguyetminh755@gmail.com',
    },
    {
        email: 'duc.nguyen291@hcmut.edu.vn',
    },
    {
        email: 'vietducvinamilk22222@gmail.com',
    },
];

export const contestRegistrationMail = (name: string) => {
    return `
<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="UTF-8" />
		<meta http-equiv="X-UA-Compatible" content="IE=edge" />
		<meta name="viewport" content="width=device-width, initial-scale=1.0" />
		<title>Email</title>

		<style>
			* {
				margin: 0;
				padding: 0;
				box-sizing: border-box;
				font-family: "Open Sans", Arial, sans-serif;
				font-size: 14px;
				text-align: justify;
			}

			.text-red {
				color: red !important;
			}

			.shaded-bg {
				background-color: #d5d6d6;
				margin: auto;
				height: 100%;
				box-sizing: content-box;
				padding: 2% 0 3% 0;
			}

			.main {
				max-width: 700px;
				margin: auto;
			}

			.white-bg {
				background-color: #fff;
			}

			.banner img {
				width: 100%;
			}

			.content {
				padding: 5% 5%;
			}

			.content p {
				margin-bottom: 10px;
				line-height: 1.4;
			}

			.footer {
				text-align: center;
				padding: 0 3% 3% 3%;
			}

			.footer img {
				width: 70%;
				height: 120%;
			}
		</style>
	</head>

	<body>
		<div class="shaded-bg">
			<div class="main">
				<div class="white-bg">
					<div class="banner">
						<img src="https://i.ibb.co/yY8CXSR/Frame-1.png" alt="" />
					</div>
					<div class="content">
						<p>Hi <span class="bold">${name}</span>,</p>
						<p>
                            Thanks for registering your idea
						</p>
						<p>
							There's a new café that just opened up downtown that I've been
							wanting to try, so how about we meet there on Wednesday at 3 PM?
							Let me know if that works for you, or if you have another time in
							mind that would be better.
						</p>
						<p>Looking forward to seeing you soon!</p>
            <p>For more information, check </p> <a href="https://gdsc.app/">https://gdsc.app/</a>
						<p>Best, GDSC HCMUT</p>
					</div>
					<div class="footer">
						<img src="https://i.ibb.co/CBXj2w4/logo.png" alt="GDSC logo" />
					</div>
				</div>
			</div>
		</div>
	</body>
</html>
  `;
};