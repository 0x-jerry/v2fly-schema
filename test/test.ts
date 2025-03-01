import type { log as Log, README } from '..'

const log: Log.LogObject = {
	loglevel: 'warning',
	access: '/var/log/v2ray/access.log',
	error: '/var/log/v2ray/error.log',
}

export const v2ray: README.V2FlyConfig = {
	log: log,
	stats: {},
	api: {
		tag: 'api',
		services: ['StatsService'],
	},
	policy: {
		levels: {
			'0': {
				statsUserUplink: true,
				statsUserDownlink: true,
			},
		},
		system: {
			statsInboundUplink: true,
			statsInboundDownlink: true,
			statsOutboundUplink: true,
			statsOutboundDownlink: true,
		},
	},
	inbounds: [
		{
			tag: 'api',
			listen: '0.0.0.0',
			port: 1111,
			protocol: 'dokodemo-door',
			settings: {
				_t: 'dokodemo-door',
				address: '0.0.0.0',
			},
		},
		{
			port: 2222,
			tag: 'vmess-ws',
			protocol: 'vmess',
			sniffing: {
				enabled: true,
				destOverride: ['http', 'tls'],
			},
			streamSettings: {
				network: 'ws',
				wsSettings: {
					path: '/ray',
				},
			},
			settings: {
				_t: 'vmess',
				clients: [
					{
						name: 'xx',
						email: 'xx',
						id: 'xxx',
						level: 0,
						alterId: 4,
					},
				],
			},
		},
	],
	outbounds: [
		{
			protocol: 'freedom',
			settings: {},
		},
		{
			protocol: 'blackhole',
			settings: {},
			tag: 'blocked',
		},
	],
	routing: {
		domainStrategy: 'AsIs',
		rules: [
			{
				inboundTag: ['api'],
				outboundTag: 'api',
				type: 'field',
			},
			{
				type: 'field',
				outboundTag: 'blocked',
				protocol: ['bittorrent'],
			},
		],
	},
}
