import { type Participant, EventName, type EventParticipation } from '../types';

const SCHOOL_NAME = '穴吹コンピュータカレッジ';

export const rawData: { eventName: EventName; team: string; details: string; members: string[] }[] = [
  {
    eventName: EventName.LeggedRace,
    team: '20人21脚チーム',
    details: '学年内訳: 1年6名・2年9名・3年5名（計20名）',
    members: ['玉城', '真島', '藤原', '向井', '河田', '三上', '齋藤', '森田', '一宮', '西村', '飯間', '山崎悟', '武智', '秋友', '岡', '滝口', '中野', '松永', '今治', '國本']
  },
  {
    eventName: EventName.Relay,
    team: '男子',
    details: '学校対抗',
    members: ['野村', '向井', '内海', '中條', '柾木']
  },
  {
    eventName: EventName.BallCarry,
    team: 'Aチーム',
    details: 'Aコース',
    members: ['丸山(1年)', '山中', '宮野', 'ペア', '松下', '片山', '竹内', '平井', '直井', '岩瀬', '河野', '大塚', '森', '植村', '茶園', '水野', '矢野', '武智', '十川', '山崎悟', '太田', '真嶋', '三好', '上井', '高木', '今治', '木村', '丸山(3年)', '細井', '高須賀']
  },
  {
    eventName: EventName.BallCarry,
    team: 'Bチーム',
    details: 'Aコース',
    members: ['小野', '福岡(1年)', '玉城', '森藤', '福家(1年)', '中條', '鴨井', '内海', '三嶋(1年)', '諏訪', '柾木', '神内', '岩瀬', '河野', '齋藤', '國方', '福井', '中村', '山崎駿', '逸見', '岡', '小笠原', '好井', '谷口', '中西', '長谷川', '藤田', '滝口', '筒井', '黒川']
  },
  {
    eventName: EventName.Tamaire,
    team: 'Aチーム',
    details: 'エントリーシート',
    members: ['松浦', '橋本', '松下', '細川', '岡山', '平井', '別枝', '蓮井', '國方', '田中', '神内', '岡田', '仁木', '吉田', '金子', '藤井', '秋友', '河野', '藤井', '井上', '泉', '福岡', '東条', '國本', '工藤']
  },
  {
    eventName: EventName.TugOfWar,
    team: '男子',
    details: 'トーナメント',
    members: ['向井', '佐々木', '三島', '山中', '野村', '片山', '福家', '山本', '南', '瀧', '井戸', '木内', '逸見', '藤本', '真嶋', '藤沢', '松永', '蕪木', '福岡', '泉']
  }
];

const processData = (): Map<string, Participant> => {
  const participantsMap = new Map<string, Participant>();

  for (const event of rawData) {
    for (const memberName of event.members) {
      const newEvent: EventParticipation = {
        eventName: event.eventName,
        team: event.team,
        details: event.details,
      };

      if (participantsMap.has(memberName)) {
        const existingParticipant = participantsMap.get(memberName)!;
        existingParticipant.events.push(newEvent);
      } else {
        const newParticipant: Participant = {
          name: memberName,
          school: SCHOOL_NAME,
          events: [newEvent],
        };
        participantsMap.set(memberName, newParticipant);
      }
    }
  }
  return participantsMap;
};

export const participantsData = processData();

export interface MemberDetail {
    grade: number;
    department: string;
}

// Data extracted from the provided entry sheet images.
export type MultiMemberDetails = Record<string, MemberDetail | MemberDetail[]>;
export const memberDetails: MultiMemberDetails = {
  '玉城': { grade: 1, department: 'IS・AI・NS' },
  '真島': { grade: 1, department: 'IS・AI・NS' },
  '藤原': { grade: 1, department: 'IS・AI・NS' },
  '向井': { grade: 1, department: 'NS' },
  '河田': { grade: 1, department: 'IS・AI・NS' },
  '三上': { grade: 1, department: 'IS・AI・NS' },
  '齋藤': { grade: 2, department: 'IS・AI' },
  '森田': { grade: 2, department: 'IS・AI' },
  '一宮': { grade: 2, department: 'IS・AI' },
  '西村': { grade: 2, department: 'IS・AI' },
  '飯間': { grade: 2, department: 'IS・AI' },
  '山崎悟': { grade: 2, department: 'NS' },
  '武智': { grade: 2, department: 'NS' },
  '秋友': { grade: 2, department: 'IB' },
  '岡': { grade: 2, department: 'IB' },
  '滝口': { grade: 3, department: 'IS・AI' },
  '中野': { grade: 3, department: 'IS・AI' },
  '松永': { grade: 3, department: 'IS・AI' },
  '今治': { grade: 3, department: 'IS・AI' },
  '國本': { grade: 3, department: 'IS・AI' },
  '野村': { grade: 1, department: 'NS' },
  '内海': { grade: 1, department: 'IS' },
  '中條': { grade: 1, department: 'AI' },
  '柾木': { grade: 2, department: 'IS' },
  '丸山': { grade: 3, department: 'IS・AI' },
  '山中': { grade: 1, department: 'IS・AI・NS' },
  '宮野': { grade: 1, department: 'IS・AI・NS' },
  'ペア': { grade: 1, department: 'IS・AI・NS' },
  '松下': { grade: 1, department: 'IS・AI・NS' },
  '片山': { grade: 1, department: 'IS・AI・NS' },
  '竹内': { grade: 1, department: 'IS・AI・NS' },
  '平井': { grade: 1, department: 'IS・AI・NS' },
  '直井': { grade: 2, department: 'IS・AI' },
  '岩瀬': { grade: 2, department: 'IS・AI' },
  '河野': { grade: 2, department: 'IS・AI' },
  '大塚': { grade: 2, department: 'IS・AI' },
  '森': { grade: 2, department: 'IS・AI' },
  '植村': { grade: 2, department: 'IS・AI' },
  '茶園': { grade: 2, department: 'IS・AI' },
  '水野': { grade: 2, department: 'IS・AI' },
  '矢野': { grade: 2, department: 'NS' },
  '十川': { grade: 2, department: 'NS' },
  '太田': { grade: 2, department: 'IB' },
  '真嶋': { grade: 2, department: 'IB' },
  '三好': { grade: 2, department: 'IB' },
  '上井': { grade: 3, department: 'IS・AI' },
  '高木': { grade: 3, department: 'IS・AI' },
  '木村': { grade: 3, department: 'IS・AI' },
  '細井': { grade: 3, department: 'IS・AI' },
  '高須賀': { grade: 3, department: 'IS・AI' },
  '小野': { grade: 1, department: 'IS・AI・NS' },
  '丸山(1年)': { grade: 1, department: 'IS・AI・NS' },
  '丸山(3年)': { grade: 3, department: 'IS・AI' },
  '福岡(3年)': { grade: 3, department: 'IS・AI' },
  '福岡(1年)': { grade: 1, department: 'IS・AI・NS' },
  '森藤': { grade: 1, department: 'IS・AI・NS' },
  '福家(2年)': { grade: 2, department: 'IS・AI' },
  '福家(1年)': { grade: 1, department: 'IS・AI・NS' },
  '鴨井': { grade: 1, department: 'IS・AI・NS' },
  '三嶋(2年)': { grade: 2, department: 'IS・AI' },
  '三嶋(1年)': { grade: 1, department: 'IS・AI・NS' },
  '諏訪': { grade: 2, department: 'IS・AI' },
  '神内': { grade: 2, department: 'IS・AI' },
  '國方': { grade: 2, department: 'IS・AI' },
  '福井': { grade: 2, department: 'NS' },
  '中村': { grade: 2, department: 'NS' },
  '山崎駿': { grade: 2, department: 'NS' },
  '逸見': { grade: 2, department: 'NS' },
  '小笠原': { grade: 2, department: 'IB' },
  '好井': { grade: 3, department: 'IS・AI' },
  '谷口': { grade: 3, department: 'IS・AI' },
  '中西': { grade: 3, department: 'IS・AI' },
  '長谷川': { grade: 3, department: 'IS・AI' },
  '藤田': { grade: 3, department: 'IS・AI' },
  '筒井': { grade: 3, department: 'IS・AI' },
  '黒川': { grade: 3, department: 'IS・AI' },
  '松浦': { grade: 1, department: 'IS・AI・NS' },
  '橋本': { grade: 1, department: 'IS・AI・NS' },
  '細川': { grade: 1, department: 'IS・AI・NS' },
  '岡山': { grade: 1, department: 'IS・AI・NS' },
  '別枝': { grade: 1, department: 'IS・AI・NS' },
  '蓮井': { grade: 1, department: 'IS・AI・NS' },
  '田中': { grade: 2, department: 'IS・AI' },
  '岡田': { grade: 2, department: 'IS・AI' },
  '仁木': { grade: 2, department: 'IS・AI' },
  '吉田': { grade: 2, department: 'NS' },
  '金子': { grade: 2, department: 'NS' },
  '藤井': [{ grade: 2, department: 'NS' }, { grade: 2, department: 'IB' }],
  '井上': { grade: 3, department: 'IS・AI' },
  '泉': { grade: 3, department: 'IS・AI' },
  '東条': { grade: 3, department: 'IS・AI' },
  '工藤': { grade: 3, department: 'IS・AI' },
  '佐々木': { grade: 1, department: 'IS・AI・NS' },
  '三島': { grade: 1, department: 'IS・AI・NS' },
  '山本': { grade: 2, department: 'IS・AI' },
  '南': { grade: 2, department: 'IS・AI' },
  '瀧': { grade: 2, department: 'IS・AI' },
  '井戸': { grade: 2, department: 'IS・AI' },
  '木内': { grade: 2, department: 'NS' },
  '藤本': { grade: 2, department: 'IB' },
  '藤沢': { grade: 3, department: 'IS・AI' },
  '蕪木': { grade: 3, department: 'IS・AI' },
};


// Lightweight runtime data validation to help spot issues during development.
// This will log potential problems in the browser console.
const validateDataIntegrity = () => {
  try {
    const allNames = new Set<string>();
    for (const e of rawData) {
      for (const n of e.members) allNames.add(n);
    }

    const detailKeys = new Set<string>(Object.keys(memberDetails));

    const missingDetails = Array.from(allNames).filter((n) => !detailKeys.has(n));
    if (missingDetails.length > 0) {
      // eslint-disable-next-line no-console
      console.warn('[DataCheck] memberDetails missing entries for:', missingDetails);
    }

    const unusedDetailKeys = Array.from(detailKeys).filter((k) => !allNames.has(k));
    if (unusedDetailKeys.length > 0) {
      // eslint-disable-next-line no-console
      console.info('[DataCheck] memberDetails has unused keys (not referenced by any event):', unusedDetailKeys);
    }

    // Detect same name repeated in the same event block (often indicates homonyms)
    const duplicateNameInSameEvent = new Set<string>();
    const eventKey = (e: { eventName: any; team: string; details: string }) => `${e.eventName}|${e.team}|${e.details}`;
    const seenByEvent = new Map<string, Set<string>>();

    for (const e of rawData) {
      const key = eventKey(e);
      const seenNames = seenByEvent.get(key) ?? new Set<string>();
      for (const n of e.members) {
        if (seenNames.has(n)) duplicateNameInSameEvent.add(n);
        seenNames.add(n);
      }
      seenByEvent.set(key, seenNames);
    }

    if (duplicateNameInSameEvent.size > 0) {
      // eslint-disable-next-line no-console
      console.info('[DataCheck] Same name appears multiple times within the same event (likely homonyms):', Array.from(duplicateNameInSameEvent));
    }
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('[DataCheck] validation failed:', err);
  }
};

validateDataIntegrity();
