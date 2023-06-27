import 'dotenv/config'

const property = {
	monit: {
		LG_WAY_FIT: {
			url: process.env.MONIT_LG_WAY_FIT_URL,
			code: process.env.MONIT_LG_WAY_FIT_CODE,
			exit: process.env.MONIT_LG_WAY_FIT_EXIT,
			cheat: process.env.MONIT_LG_WAY_FIT_CHEAT,
		},
		S_OIL: {
			url: process.env.MONIT_URL,
			code: process.env.MONIT_S_OIL,
			exit: process.env.MONIT_EXIT,
			cheat: process.env.MONIT_CHEAT,
		},
		ACG: {
			url: process.env.MONIT_URL,
			code: process.env.MONIT_ACG,
			exit: process.env.MONIT_EXIT,
			cheat: process.env.MONIT_CHEAT,
		},
		KT: {
			url: process.env.MONIT_URL,
			code: process.env.MONIT_KT,
			exit: process.env.MONIT_EXIT,
			cheat: process.env.MONIT_CHEAT,
		},
		HYUNDAI: {
			url: process.env.MONIT_URL,
			code: process.env.MONIT_HYUNDAI,
			exit: process.env.MONIT_EXIT,
			cheat: process.env.MONIT_CHEAT,
		},
	},
	platformTest: {
		SELECT: {
			url: process.env.ACG_PLATFORM_TEST_URL,
			code: process.env.ACG_PLATFORM_SELECT,
			exit: process.env.ACG_PLATFORM_EXIT,
			cheat: process.env.ACG_PLATFORM_CHEAT,
		},
		ACG: {
			url: process.env.ACG_PLATFORM_TEST_URL,
			code: process.env.ACG_PLATFORM_ACG,
			exit: process.env.ACG_PLATFORM_EXIT,
			cheat: process.env.ACG_PLATFORM_CHEAT,
		},
		LG_WAY_FIT: {
			url: process.env.ACG_PLATFORM_TEST_URL,
			code: process.env.ACG_PLATFORM_LG_WAY_FIT,
			exit: process.env.ACG_PLATFORM_EXIT,
			cheat: process.env.ACG_PLATFORM_CHEAT,
		},
		LG_UPLUS: {
			url: process.env.ACG_PLATFORM_TEST_URL,
			code: process.env.ACG_PLATFORM_LG_UPLUS,
			exit: process.env.ACG_PLATFORM_EXIT,
			cheat: process.env.ACG_PLATFORM_CHEAT,
		},
		S_OIL: {
			url: process.env.ACG_PLATFORM_TEST_URL,
			code: process.env.ACG_PLATFORM_S_OIL,
			exit: process.env.ACG_PLATFORM_EXIT,
			cheat: process.env.ACG_PLATFORM_CHEAT,
		},
	},
	platform: {
		SELECT: {
			url: process.env.ACG_PLATFORM_URL,
			code: process.env.ACG_PLATFORM_SELECT,
			exit: process.env.ACG_PLATFORM_EXIT,
			cheat: process.env.ACG_PLATFORM_CHEAT,
		},
		ACG: {
			url: process.env.ACG_PLATFORM_URL,
			code: process.env.ACG_PLATFORM_ACG,
			exit: process.env.ACG_PLATFORM_EXIT,
			cheat: process.env.ACG_PLATFORM_CHEAT,
		},
		LG_WAY_FIT: {
			url: process.env.ACG_PLATFORM_URL,
			code: process.env.ACG_PLATFORM_LG_WAY_FIT,
			exit: process.env.ACG_PLATFORM_EXIT,
			cheat: process.env.ACG_PLATFORM_CHEAT,
		},
		LG_UPLUS: {
			url: process.env.ACG_PLATFORM_URL,
			code: process.env.ACG_PLATFORM_LG_UPLUS,
			exit: process.env.ACG_PLATFORM_EXIT,
			cheat: process.env.ACG_PLATFORM_CHEAT,
		},
		S_OIL: {
			url: process.env.ACG_PLATFORM_URL,
			code: process.env.ACG_PLATFORM_S_OIL,
			exit: process.env.ACG_PLATFORM_EXIT,
			cheat: process.env.ACG_PLATFORM_CHEAT,
		},
		LGCHEM: {
			url: process.env.ACG_PLATFORM_URL,
			code: process.env.ACG_PLATFORM_LGCHEM,
			exit: process.env.ACG_PLATFORM_EXIT,
			cheat: process.env.ACG_PLATFORM_CHEAT,
		},
		CAU: {
			url: process.env.ACG_PLATFORM_URL,
			code: process.env.ACG_PLATFORM_CAU,
			exit: process.env.ACG_PLATFORM_EXIT,
			cheat: process.env.ACG_PLATFORM_CHEAT,
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
