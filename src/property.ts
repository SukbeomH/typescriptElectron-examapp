import 'dotenv/config'

const property = {
	monit: {
		LG_WAY_FIT: {
			url: "https://lg.insahr.co.kr/",
			code: "",
			exit: "?mode=out",
			cheat: "cheat",
		},
		S_OIL: {
			url: "https://monit.insahr.co.kr/",
			code: "?c=S-OIL",
			exit: "?mode=out",
			cheat: "cheat",
		},
		ACG: {
			url: "https://monit.insahr.co.kr/",
			code: "?c=ACG",
			exit: "?mode=out",
			cheat: "cheat",
		},
		KT: {
			url: "https://monit.insahr.co.kr/",
			code: "?c=kt",
			exit: "?mode=out",
			cheat: "cheat",
		},
		HYUNDAI: {
			url: "https://monit.insahr.co.kr/",
			code: "?c=hyundai",
			exit: "?mode=out",
			cheat: "cheat",
		},
	},
	platformTest: {
		SELECT: {
			url: "https://test-acg-apply.insahr.co.kr/",
			code: "",
			exit: "logout",
			cheat: "cheat",
		},
		ACG: {
			url: "https://test-acg-apply.insahr.co.kr/",
			code: "?code=ACG",
			exit: "logout",
			cheat: "cheat",
		},
		LG_WAY_FIT: {
			url: "https://test-acg-apply.insahr.co.kr/",
			code: "?code=LG_WAYFIT",
			exit: "logout",
			cheat: "cheat",
		},
		LG_UPLUS: {
			url: "https://test-acg-apply.insahr.co.kr/",
			code: "?code=LG_UPLUS",
			exit: "logout",
			cheat: "cheat",
		},
		S_OIL: {
			url: "https://test-acg-apply.insahr.co.kr/",
			code: "?code=S-OIL",
			exit: "logout",
			cheat: "cheat",
		},
	},
	platform: {
		SELECT: {
			url: "https://acg-apply.insahr.co.kr/",
			code: "",
			exit: "logout",
			cheat: "cheat",
		},
		ACG: {
			url: "https://acg-apply.insahr.co.kr/",
			code: "?code=ACG",
			exit: "logout",
			cheat: "cheat",
		},
		LG_WAY_FIT: {
			url: "https://acg-apply.insahr.co.kr/",
			code: "?code=LG_WAYFIT",
			exit: "logout",
			cheat: "cheat",
		},
		LG_UPLUS: {
			url: "https://acg-apply.insahr.co.kr/",
			code: "?code=LG_UPLUS",
			exit: "logout",
			cheat: "cheat",
		},
		S_OIL: {
			url: "https://acg-apply.insahr.co.kr/",
			code: "?code=S-OIL",
			exit: "logout",
			cheat: "cheat",
		},
		LGCHEM: {
			url: "https://acg-apply.insahr.co.kr/",
			code: "?code=LGCHEM",
			exit: "logout",
			cheat: "cheat",
		},
		CAU: {
			url: "https://acg-apply.insahr.co.kr/",
			code: "?code=CAU",
			exit: "logout",
			cheat: "cheat",
		},
	},
	TEST: {
		url: "",
		code: "",
		exit: "",
		cheat: "",
	},
};

export const getPlatform = (platform: string) => {
  if (platform === 'TEST') return property.TEST;
  return property.platform[platform];
};
