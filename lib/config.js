// Konfigurasi server IMAP untuk berbagai penyedia email
const IMAP_SERVERS = {
    // Google
    'gmail.com': { host: 'imap.gmail.com', port: 993, tls: true },
    'googlemail.com': { host: 'imap.gmail.com', port: 993, tls: true },
    
    // Yahoo
    'yahoo.com': { host: 'imap.mail.yahoo.com', port: 993, tls: true },
    'yahoo.co.id': { host: 'imap.mail.yahoo.com', port: 993, tls: true },
    'ymail.com': { host: 'imap.mail.yahoo.com', port: 993, tls: true },
    'rocketmail.com': { host: 'imap.mail.yahoo.com', port: 993, tls: true },
    
    // Microsoft
    'outlook.com': { host: 'imap-mail.outlook.com', port: 993, tls: true },
    'hotmail.com': { host: 'imap-mail.outlook.com', port: 993, tls: true },
    'live.com': { host: 'imap-mail.outlook.com', port: 993, tls: true },
    'msn.com': { host: 'imap-mail.outlook.com', port: 993, tls: true },
    
    // AOL
    'aol.com': { host: 'imap.aol.com', port: 993, tls: true },
    'aim.com': { host: 'imap.aol.com', port: 993, tls: true },
    
    // Apple
    'icloud.com': { host: 'imap.mail.me.com', port: 993, tls: true },
    'me.com': { host: 'imap.mail.me.com', port: 993, tls: true },
    'mac.com': { host: 'imap.mail.me.com', port: 993, tls: true },
    
    // Zoho
    'zoho.com': { host: 'imap.zoho.com', port: 993, tls: true },
    'zohomail.com': { host: 'imap.zoho.com', port: 993, tls: true },
    'zoho.eu': { host: 'imap.zoho.eu', port: 993, tls: true },
    
    // Mail.com
    'mail.com': { host: 'imap.mail.com', port: 993, tls: true },
    'email.com': { host: 'imap.mail.com', port: 993, tls: true },
    'gmx.com': { host: 'imap.gmx.com', port: 993, tls: true },
    'gmx.net': { host: 'imap.gmx.com', port: 993, tls: true },
    'gmx.fr': { host: 'imap.gmx.fr', port: 993, tls: true },
    'gmx.de': { host: 'imap.gmx.de', port: 993, tls: true },
    'gmx.at': { host: 'imap.gmx.net', port: 993, tls: true },
    'gmx.ch': { host: 'imap.gmx.net', port: 993, tls: true },
    
    // Yandex
    'yandex.com': { host: 'imap.yandex.com', port: 993, tls: true },
    'yandex.ru': { host: 'imap.yandex.com', port: 993, tls: true },
    
    // QQ
    'qq.com': { host: 'imap.qq.com', port: 993, tls: true },
    'foxmail.com': { host: 'imap.qq.com', port: 993, tls: true },
    
    // ProtonMail (memerlukan bridge)
    'protonmail.com': { host: '127.0.0.1', port: 1143, tls: false },
    'proton.me': { host: '127.0.0.1', port: 1143, tls: false },
    'protonmail.ch': { host: '127.0.0.1', port: 1143, tls: false },
    'protonmail.de': { host: '127.0.0.1', port: 1143, tls: false },
    
    // Tutanota
    'tutanota.com': { host: 'imap.tutanota.com', port: 993, tls: true },
    'tuta.io': { host: 'imap.tutanota.com', port: 993, tls: true },
    'tutanota.de': { host: 'imap.tutanota.de', port: 993, tls: true },
    
    // Russia
    'mail.ru': { host: 'imap.mail.ru', port: 993, tls: true },
    'bk.ru': { host: 'imap.mail.ru', port: 993, tls: true },
    'list.ru': { host: 'imap.mail.ru', port: 993, tls: true },
    'inbox.ru': { host: 'imap.mail.ru', port: 993, tls: true },
    'rambler.ru': { host: 'imap.rambler.ru', port: 993, tls: true },
    
    // Other providers
    'lycos.com': { host: 'imap.lycos.com', port: 993, tls: true },
    'rediffmail.com': { host: 'imap.rediffmail.com', port: 993, tls: true },
    'freenet.de': { host: 'imap.freenet.de', port: 993, tls: true },
    'web.de': { host: 'imap.web.de', port: 993, tls: true },
    'orange.fr': { host: 'imap.orange.fr', port: 993, tls: true },
    'sfr.fr': { host: 'imap.sfr.fr', port: 993, tls: true },
    'laposte.net': { host: 'imap.laposte.net', port: 993, tls: true },
    't-online.de': { host: 'secureimap.t-online.de', port: 993, tls: true },
    'alice.it': { host: 'imap.alice.it', port: 993, tls: true },
    'libero.it': { host: 'imap.libero.it', port: 993, tls: true },
    'virgilio.it': { host: 'imap.virgilio.it', port: 993, tls: true },
    
    // Korea
    'naver.com': { host: 'imap.naver.com', port: 993, tls: true },
    'daum.net': { host: 'imap.daum.net', port: 993, tls: true },
    'nate.com': { host: 'imap.nate.com', port: 993, tls: true },
    'hanmail.net': { host: 'imap.hanmail.net', port: 993, tls: true },
    
    // Czech Republic
    'seznam.cz': { host: 'imap.seznam.cz', port: 993, tls: true },
    
    // Poland
    'wp.pl': { host: 'imap.wp.pl', port: 993, tls: true },
    'wp.eu': { host: 'imap.wp.pl', port: 993, tls: true },
    'o2.pl': { host: 'imap.o2.pl', port: 993, tls: true },
    'onet.pl': { host: 'imap.onet.pl', port: 993, tls: true },
    'onet.eu': { host: 'imap.onet.eu', port: 993, tls: true },
    'interia.pl': { host: 'imap.interia.pl', port: 993, tls: true },
    'interia.eu': { host: 'imap.interia.eu', port: 993, tls: true },
    
    // Netherlands
    'ziggo.nl': { host: 'imap.ziggo.nl', port: 993, tls: true },
    'kpnmail.nl': { host: 'imap.kpnmail.nl', port: 993, tls: true },
    'telfort.nl': { host: 'imap.telfort.nl', port: 993, tls: true },
    'planet.nl': { host: 'imap.planet.nl', port: 993, tls: true },
    'home.nl': { host: 'imap.home.nl', port: 993, tls: true },
    'xs4all.nl': { host: 'imap.xs4all.nl', port: 993, tls: true },
    'chello.nl': { host: 'imap.chello.nl', port: 993, tls: true },
    
    // Italy
    'tiscali.it': { host: 'imap.tiscali.it', port: 993, tls: true },
    'tiscali.co.uk': { host: 'imap.tiscali.co.uk', port: 993, tls: true },
    
    // Australia
    'optusnet.com.au': { host: 'mail.optusnet.com.au', port: 993, tls: true },
    'bigpond.com': { host: 'imap.bigpond.com', port: 993, tls: true },
    'telstra.com': { host: 'imap.telstra.com', port: 993, tls: true },
    'telstra.com.au': { host: 'imap.telstra.com.au', port: 993, tls: true },
    'bigpond.net.au': { host: 'imap.bigpond.com', port: 993, tls: true },
    'bigpond.net': { host: 'imap.bigpond.com', port: 993, tls: true },
    'optus.com.au': { host: 'mail.optus.com.au', port: 993, tls: true },
    'optusnet.net.au': { host: 'mail.optusnet.com.au', port: 993, tls: true },
    'tpg.com.au': { host: 'mail.tpg.com.au', port: 993, tls: true },
    'iinet.net.au': { host: 'mail.iinet.net.au', port: 993, tls: true },
    'westnet.com.au': { host: 'mail.westnet.com.au', port: 993, tls: true },
    'internode.on.net': { host: 'mail.internode.on.net', port: 993, tls: true },
    'adam.com.au': { host: 'mail.adam.com.au', port: 993, tls: true },
    'dodo.com.au': { host: 'mail.dodo.com.au', port: 993, tls: true },
    'exetel.com.au': { host: 'mail.exetel.com.au', port: 993, tls: true },
    'aapt.net.au': { host: 'mail.aapt.net.au', port: 993, tls: true },
    'chariot.net.au': { host: 'mail.chariot.net.au', port: 993, tls: true },
    'primus.com.au': { host: 'mail.primus.com.au', port: 993, tls: true },
    'iprimus.com.au': { host: 'mail.iprimus.com.au', port: 993, tls: true },
    'netspace.net.au': { host: 'mail.netspace.net.au', port: 993, tls: true },
    'netconnect.com.au': { host: 'mail.netconnect.com.au', port: 993, tls: true },
    'pacific.net.au': { host: 'mail.pacific.net.au', port: 993, tls: true },
    'spin.net.au': { host: 'mail.spin.net.au', port: 993, tls: true },
    'tech2u.com.au': { host: 'mail.tech2u.com.au', port: 993, tls: true },
    'westnet.net.au': { host: 'mail.westnet.com.au', port: 993, tls: true },
    'swiftdsl.com.au': { host: 'mail.swiftdsl.com.au', port: 993, tls: true },
    'netspeed.com.au': { host: 'mail.netspeed.com.au', port: 993, tls: true },
    'lightning.net.au': { host: 'mail.lightning.net.au', port: 993, tls: true },
    
    // New Zealand
    'slingshot.co.nz': { host: 'mail.slingshot.co.nz', port: 993, tls: true },
    'actrix.co.nz': { host: 'mail.actrix.co.nz', port: 993, tls: true },
    'clear.net.nz': { host: 'mail.clear.net.nz', port: 993, tls: true },
    'paradise.net.nz': { host: 'mail.paradise.net.nz', port: 993, tls: true },
    'vodafone.co.nz': { host: 'mail.vodafone.co.nz', port: 993, tls: true },
    'spark.co.nz': { host: 'mail.spark.co.nz', port: 993, tls: true },
    '2degrees.nz': { host: 'mail.2degrees.nz', port: 993, tls: true },
    'inspire.net.nz': { host: 'mail.inspire.net.nz', port: 993, tls: true },
    'woosh.co.nz': { host: 'mail.woosh.co.nz', port: 993, tls: true },
    'globe.net.nz': { host: 'mail.globe.net.nz', port: 993, tls: true },
    'wave.co.nz': { host: 'mail.wave.co.nz', port: 993, tls: true },
    'iconz.co.nz': { host: 'mail.iconz.co.nz', port: 993, tls: true },
    'callplus.co.nz': { host: 'mail.callplus.co.nz', port: 993, tls: true },
    'ihug.co.nz': { host: 'mail.ihug.co.nz', port: 993, tls: true },
    'snap.net.nz': { host: 'mail.snap.net.nz', port: 993, tls: true },
    'voyager.co.nz': { host: 'mail.voyager.co.nz', port: 993, tls: true },
    'orcon.net.nz': { host: 'mail.orcon.net.nz', port: 993, tls: true },
    'world-net.co.nz': { host: 'mail.world-net.co.nz', port: 993, tls: true },
    'kiwilink.co.nz': { host: 'mail.kiwilink.co.nz', port: 993, tls: true },
    'compass.co.nz': { host: 'mail.compass.co.nz', port: 993, tls: true },
    'wave.net.nz': { host: 'mail.wave.net.nz', port: 993, tls: true },
    'maxnet.co.nz': { host: 'mail.maxnet.co.nz', port: 993, tls: true },
    'net4u.co.nz': { host: 'mail.net4u.co.nz', port: 993, tls: true },
    'ext.co.nz': { host: 'mail.ext.co.nz', port: 993, tls: true },
    'xtra.co.nz': { host: 'imap.xtra.co.nz', port: 993, tls: true },
    
    // Brazil
    'terra.com.br': { host: 'imap.terra.com.br', port: 993, tls: true },
    'bol.com.br': { host: 'imap.bol.com.br', port: 993, tls: true },
    'uol.com.br': { host: 'imap.uol.com.br', port: 993, tls: true },
    'ig.com.br': { host: 'imap.ig.com.br', port: 993, tls: true },
    'r7.com': { host: 'imap.r7.com', port: 993, tls: true },
    'globo.com': { host: 'imap.gmail.com', port: 993, tls: true },
    
    // China
    '163.com': { host: 'imap.163.com', port: 993, tls: true },
    '126.com': { host: 'imap.126.com', port: 993, tls: true },
    'yeah.net': { host: 'imap.yeah.net', port: 993, tls: true },
    'sina.com': { host: 'imap.sina.com', port: 993, tls: true },
    'sohu.com': { host: 'imap.sohu.com', port: 993, tls: true },
    '139.com': { host: 'imap.139.com', port: 993, tls: true },
    '189.cn': { host: 'imap.189.cn', port: 993, tls: true },
    'wo.com.cn': { host: 'imap.wo.com.cn', port: 993, tls: true },
    '21cn.com': { host: 'imap.21cn.com', port: 993, tls: true },
    'tom.com': { host: 'imap.tom.com', port: 993, tls: true },
    'sina.cn': { host: 'imap.sina.cn', port: 993, tls: true },
    
    // Taiwan
    'seed.net.tw': { host: 'imap.seed.net.tw', port: 993, tls: true },
    'ms1.hinet.net': { host: 'imap.hinet.net', port: 993, tls: true },
    'pchome.com.tw': { host: 'imap.pchome.com.tw', port: 993, tls: true },
    'yahoo.com.tw': { host: 'imap.mail.yahoo.com.tw', port: 993, tls: true },
    'gmail.com.tw': { host: 'imap.gmail.com', port: 993, tls: true },
    
    // UK
    'btinternet.com': { host: 'imap.btinternet.com', port: 993, tls: true },
    'talktalk.net': { host: 'imap.talktalk.net', port: 993, tls: true },
    'sky.com': { host: 'imap.tools.sky.com', port: 993, tls: true },
    'virginmedia.com': { host: 'imap.virginmedia.com', port: 993, tls: true },
    'mailbox.org.uk': { host: 'imap.mailbox.org', port: 993, tls: true },
    'blueyonder.co.uk': { host: 'imap.virginmedia.com', port: 993, tls: true },
    'ntlworld.com': { host: 'imap.virginmedia.com', port: 993, tls: true },
    
    // USA ISP
    'comcast.net': { host: 'imap.comcast.net', port: 993, tls: true },
    'verizon.net': { host: 'incoming.verizon.net', port: 993, tls: true },
    'att.net': { host: 'imap.mail.att.net', port: 993, tls: true },
    'bellsouth.net': { host: 'imap.mail.att.net', port: 993, tls: true },
    'sbcglobal.net': { host: 'imap.mail.att.net', port: 993, tls: true },
    'earthlink.net': { host: 'imap.earthlink.net', port: 993, tls: true },
    'cox.net': { host: 'imap.cox.net', port: 993, tls: true },
    'charter.net': { host: 'imap.charter.net', port: 993, tls: true },
    'twc.com': { host: 'mail.twc.com', port: 993, tls: true },
    'roadrunner.com': { host: 'mail.twc.com', port: 993, tls: true },
    'brighthouse.com': { host: 'imap.brighthouse.com', port: 993, tls: true },
    'optimum.net': { host: 'imap.optimum.net', port: 993, tls: true },
    'optonline.net': { host: 'imap.optonline.net', port: 993, tls: true },
    'cablevision.com': { host: 'imap.cablevision.com', port: 993, tls: true },
    'frontier.com': { host: 'imap.frontier.com', port: 993, tls: true },
    'frontiernet.net': { host: 'imap.frontiernet.net', port: 993, tls: true },
    'windstream.net': { host: 'imap.windstream.net', port: 993, tls: true },
    'centurylink.net': { host: 'imap.centurylink.net', port: 993, tls: true },
    'qwest.net': { host: 'imap.qwest.net', port: 993, tls: true },
    'embarqmail.com': { host: 'imap.embarqmail.com', port: 993, tls: true },
    'mediacombb.net': { host: 'imap.mediacombb.net', port: 993, tls: true },
    'suddenlink.net': { host: 'imap.suddenlink.net', port: 993, tls: true },
    'rcn.com': { host: 'imap.rcn.com', port: 993, tls: true },
    'wow.com': { host: 'imap.wow.com', port: 993, tls: true },
    'metrocast.net': { host: 'imap.metrocast.net', port: 993, tls: true },
    'hawaiiantel.net': { host: 'imap.hawaiiantel.net', port: 993, tls: true },
    'alaska.net': { host: 'imap.alaska.net', port: 993, tls: true },
    'gci.net': { host: 'imap.gci.net', port: 993, tls: true },
    'clearwire.net': { host: 'imap.clearwire.net', port: 993, tls: true },
    'rr.com': { host: 'mail.twc.com', port: 993, tls: true },
    'spectrum.net': { host: 'mail.twc.com', port: 993, tls: true },
    'mail.t-online.de': { host: 'secureimap.t-online.de', port: 993, tls: true },
    'webmail.t-online.de': { host: 'secureimap.t-online.de', port: 993, tls: true },
    'webmail.de': { host: 'imap.webmail.de', port: 993, tls: true },
    'xfinity.com': { host: 'imap.xfinity.com', port: 993, tls: true },
    'usa.net': { host: 'imap.usa.net', port: 993, tls: true },
    'juno.com': { host: 'imap.juno.com', port: 993, tls: true },
    'netzero.net': { host: 'imap.netzero.net', port: 993, tls: true },
    'peoplepc.com': { host: 'imap.peoplepc.com', port: 993, tls: true },
    'bluelight.com': { host: 'imap.bluelight.com', port: 993, tls: true },
    'excite.com': { host: 'imap.excite.com', port: 993, tls: true },
    'altavista.com': { host: 'imap.altavista.com', port: 993, tls: true },
    'netscape.net': { host: 'imap.netscape.net', port: 993, tls: true },
    'wmconnect.com': { host: 'imap.wmconnect.com', port: 993, tls: true },
    'iwon.com': { host: 'imap.iwon.com', port: 993, tls: true },
    'mail2world.com': { host: 'imap.mail2world.com', port: 993, tls: true },
    'myway.com': { host: 'imap.myway.com', port: 993, tls: true },
    
    // Japan
    'yahoo.co.jp': { host: 'imap.mail.yahoo.co.jp', port: 993, tls: true },
    'docomo.ne.jp': { host: 'imap.spmode.ne.jp', port: 993, tls: true },
    'ezweb.ne.jp': { host: 'imap.ezweb.ne.jp', port: 993, tls: true },
    'au.com': { host: 'imap.mail.au.com', port: 993, tls: true },
    'softbank.ne.jp': { host: 'imap.softbank.ne.jp', port: 993, tls: true },
    'biglobe.ne.jp': { host: 'imap.biglobe.ne.jp', port: 993, tls: true },
    'nifty.com': { host: 'imap.nifty.com', port: 993, tls: true },
    'so-net.ne.jp': { host: 'imap.so-net.ne.jp', port: 993, tls: true },
    'ocn.ne.jp': { host: 'imap.ocn.ne.jp', port: 993, tls: true },
    // OCN subdomains - menggunakan imap.ocn.ne.jp yang sudah terbukti bekerja
    'juno.ocn.ne.jp': { host: 'imap.ocn.ne.jp', port: 993, tls: true },
    'hop.ocn.ne.jp': { host: 'imap.ocn.ne.jp', port: 993, tls: true },
    'luck.ocn.ne.jp': { host: 'imap.ocn.ne.jp', port: 993, tls: true },
    'tiara.ocn.ne.jp': { host: 'imap.ocn.ne.jp', port: 993, tls: true },
    'jeans.ocn.ne.jp': { host: 'imap.ocn.ne.jp', port: 993, tls: true },
    'plala.or.jp': { host: 'imap.plala.or.jp', port: 993, tls: true },
    'dion.ne.jp': { host: 'imap.dion.ne.jp', port: 993, tls: true },
    'hi-ho.ne.jp': { host: 'imap.hi-ho.ne.jp', port: 993, tls: true },
    'livedoor.com': { host: 'imap.livedoor.com', port: 993, tls: true },
    'excite.co.jp': { host: 'imap.excite.co.jp', port: 993, tls: true },
    'infoseek.jp': { host: 'imap.infoseek.jp', port: 993, tls: true },
    'goo.ne.jp': { host: 'imap.goo.ne.jp', port: 993, tls: true },
    'msn.co.jp': { host: 'imap.msn.co.jp', port: 993, tls: true },
    'hotmail.co.jp': { host: 'imap-mail.outlook.com', port: 993, tls: true },
    'outlook.jp': { host: 'imap-mail.outlook.com', port: 993, tls: true },
    
    // Estonia, Bulgaria, Czech, Switzerland, etc.
    'mail.ee': { host: 'mail.ee', port: 993, tls: true },
    'abv.bg': { host: 'imap.abv.bg', port: 993, tls: true },
    'centrum.cz': { host: 'imap.centrum.cz', port: 993, tls: true },
    'bluewin.ch': { host: 'imap.bluewin.ch', port: 993, tls: true },
    'mail.bg': { host: 'imap.mail.bg', port: 993, tls: true },
    't-online.hu': { host: 'imap.t-online.hu', port: 993, tls: true },
    'mail.kz': { host: 'imap.mail.kz', port: 993, tls: true },
    'mail.ua': { host: 'imap.ukr.net', port: 993, tls: true },
    'ukr.net': { host: 'imap.ukr.net', port: 993, tls: true },
    'volny.cz': { host: 'imap.volny.cz', port: 993, tls: true },
    
    // France
    'wanadoo.fr': { host: 'imap.wanadoo.fr', port: 993, tls: true },
    'free.fr': { host: 'imap.free.fr', port: 993, tls: true },
    'aliceadsl.fr': { host: 'imap.aliceadsl.fr', port: 993, tls: true },
    'numericable.fr': { host: 'imap.numericable.fr', port: 993, tls: true },
    
    // Belgium
    'skynet.be': { host: 'imap.skynet.be', port: 993, tls: true },
    'telenet.be': { host: 'imap.telenet.be', port: 993, tls: true },
    'mail.be': { host: 'imap.mail.be', port: 993, tls: true },
    
    // Nordic countries
    'mail.dk': { host: 'imap.mail.dk', port: 993, tls: true },
    'mail.no': { host: 'imap.mail.no', port: 993, tls: true },
    'mail.se': { host: 'imap.mail.se', port: 993, tls: true },
    'mail.fi': { host: 'imap.mail.fi', port: 993, tls: true },
    
    // Other countries
    'mail.com.tr': { host: 'imap.mail.com.tr', port: 993, tls: true },
    'posta.hu': { host: 'imap.posta.hu', port: 993, tls: true },
    'mail.gr': { host: 'imap.mail.gr', port: 993, tls: true },
    'mail.pt': { host: 'imap.mail.pt', port: 993, tls: true },
    'mail.pl': { host: 'imap.mail.pl', port: 993, tls: true },
    'mail.cz': { host: 'imap.mail.cz', port: 993, tls: true },
    'arcor.de': { host: 'imap.arcor.de', port: 993, tls: true },
    'vodafone.de': { host: 'imap.vodafonemail.de', port: 993, tls: true },
    'posteo.de': { host: 'imap.posteo.de', port: 993, tls: true },
    'mailbox.org': { host: 'imap.mailbox.org', port: 993, tls: true },
    'webmail.co.za': { host: 'imap.webmail.co.za', port: 993, tls: true },
    'mail.com.au': { host: 'imap.mail.com.au', port: 993, tls: true },
    'runbox.com': { host: 'imap.runbox.com', port: 993, tls: true },
    'fastmail.com': { host: 'imap.fastmail.com', port: 993, tls: true },
    'mailfence.com': { host: 'imap.mailfence.com', port: 993, tls: true },
    'email.it': { host: 'imap.email.it', port: 993, tls: true },
    'tin.it': { host: 'imap.tin.it', port: 993, tls: true },
    'aliceposta.it': { host: 'imap.aliceposta.it', port: 993, tls: true },
    
    // Universities and organizations
    'alumni.stanford.edu': { host: 'imap.stanford.edu', port: 993, tls: true },
    'mit.edu': { host: 'imap.mit.edu', port: 993, tls: true },
    'harvard.edu': { host: 'imap.fas.harvard.edu', port: 993, tls: true },
    'ox.ac.uk': { host: 'imap.ox.ac.uk', port: 993, tls: true },
    'cam.ac.uk': { host: 'imap.hermes.cam.ac.uk', port: 993, tls: true },
    'umich.edu': { host: 'imap.mail.umich.edu', port: 993, tls: true },
    'berkeley.edu': { host: 'imap.berkeley.edu', port: 993, tls: true },
    'cornell.edu': { host: 'imap.cornell.edu', port: 993, tls: true },
    'yale.edu': { host: 'imap.yale.edu', port: 993, tls: true },
    'princeton.edu': { host: 'imap.princeton.edu', port: 993, tls: true },
    'ui.ac.id': { host: 'mail.ui.ac.id', port: 993, tls: true },
    'itb.ac.id': { host: 'mail.itb.ac.id', port: 993, tls: true },
    'ugm.ac.id': { host: 'mail.ugm.ac.id', port: 993, tls: true },
    'binus.ac.id': { host: 'mail.binus.ac.id', port: 993, tls: true },
    'uns.ac.id': { host: 'mail.uns.ac.id', port: 993, tls: true },
    'ipb.ac.id': { host: 'mail.ipb.ac.id', port: 993, tls: true },
    'unair.ac.id': { host: 'mail.unair.ac.id', port: 993, tls: true },
    'telkomuniversity.ac.id': { host: 'mail.telkomuniversity.ac.id', port: 993, tls: true },
    
    // Corporate
    'ibm.com': { host: 'imap.mail.ibm.com', port: 993, tls: true },
    'oracle.com': { host: 'imap.oracle.com', port: 993, tls: true },
    'microsoft.com': { host: 'outlook.office365.com', port: 993, tls: true },
    'apple.com': { host: 'imap.mail.me.com', port: 993, tls: true },
    'amazon.com': { host: 'imap.amazon.com', port: 993, tls: true },
    'google.com': { host: 'imap.gmail.com', port: 993, tls: true },
    'facebook.com': { host: 'imap.facebook.com', port: 993, tls: true },
    'twitter.com': { host: 'imap.twitter.com', port: 993, tls: true },
    'cisco.com': { host: 'imap.cisco.com', port: 993, tls: true },
    'dell.com': { host: 'imap.dell.com', port: 993, tls: true },
    'hp.com': { host: 'imap.hp.com', port: 993, tls: true },
    'intel.com': { host: 'imap.intel.com', port: 993, tls: true },
    'adobe.com': { host: 'imap.adobe.com', port: 993, tls: true },
    'siemens.com': { host: 'imap.siemens.com', port: 993, tls: true },
    'samsung.com': { host: 'imap.samsung.com', port: 993, tls: true },
    'huawei.com': { host: 'imap.huawei.com', port: 993, tls: true },
    'sony.com': { host: 'imap.sony.com', port: 993, tls: true },
    'lg.com': { host: 'imap.lg.com', port: 993, tls: true },
    'panasonic.com': { host: 'imap.panasonic.com', port: 993, tls: true },
    'unilever.com': { host: 'imap.unilever.com', port: 993, tls: true },
    'nestle.com': { host: 'imap.nestle.com', port: 993, tls: true },
    'shell.com': { host: 'imap.shell.com', port: 993, tls: true },
    'bp.com': { host: 'imap.bp.com', port: 993, tls: true },
    'total.com': { host: 'imap.total.com', port: 993, tls: true },
    'toyota.com': { host: 'imap.toyota.com', port: 993, tls: true },
    'volkswagen.com': { host: 'imap.volkswagen.com', port: 993, tls: true },
    'ford.com': { host: 'imap.ford.com', port: 993, tls: true },
    'gm.com': { host: 'imap.gm.com', port: 993, tls: true }
};

// Default timeout untuk koneksi (dalam milidetik)
const DEFAULT_TIMEOUT = 20000;

// Default port untuk IMAP
const DEFAULT_IMAP_PORT = 993;

module.exports = {
    IMAP_SERVERS,
    DEFAULT_TIMEOUT,
    DEFAULT_IMAP_PORT
};
