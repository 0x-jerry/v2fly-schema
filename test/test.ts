import { IV2Ray, LogLevel, APIService, V2RayProtocol, IStrategy } from '../src'

export const v2ray: IV2Ray = {
  log: {
    loglevel: LogLevel.warning,
    access: '/var/log/v2ray/access.log',
    error: '/var/log/v2ray/error.log',
  },
  stats: {},
  api: {
    tag: 'api',
    services: [APIService.StatsService],
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
      protocol: V2RayProtocol.DOKODEMO_DOOR,
      settings: {
        address: '0.0.0.0',
      },
    },
    {
      port: 2222,
      tag: 'vmess-ws',
      protocol: V2RayProtocol.VMESS,
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
      protocol: V2RayProtocol.FREEDOM,
      settings: {},
    },
    {
      protocol: V2RayProtocol.BLACKHOLE,
      settings: {},
      tag: 'blocked',
    },
  ],
  routing: {
    domainStrategy: IStrategy.AsIs,
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
