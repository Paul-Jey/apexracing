/**
 * Everything the team edits lives here.
 *
 * Rules for whoever updates this file:
 *  - No em dashes. Full stops, commas, colons or brackets instead.
 *  - Never put a number, result or name in here that isn't in a report, the
 *    proposal, or confirmed by the team. If it isn't confirmed yet, set
 *    `confirm: true` on the item and it shows a review chip in draft mode
 *    (open the site with ?draft=1 to see them).
 *  - Numbers render with tabular figures, so keep them as plain strings.
 */

export type Confirmable = { confirm?: boolean };

export const meta = {
  title: 'Apex Racing · SSN College of Engineering EV Karting Team',
  description:
    'Apex Racing is the electric karting team of SSN College of Engineering, Chennai. We design, build and race our own karts. P1 in acceleration at FKDC 2025.',
  url: 'https://apexracingssn.vercel.app/',
  ogImage: 'assets/og.jpg',
  season: '2026',
};

export const team = {
  name: 'Apex Racing',
  college: 'SSN College of Engineering',
  city: 'Chennai',
  teamId: 'K25E21',
  category: 'EV · FKDC',
  founderNote: 'Founded by Mr. Shiv Nadar, Chairman of HCL Technologies.',
  rankings: [
    { value: '7', suffix: 'th', label: 'Among private engineering colleges in India', source: 'EduRand' },
    { value: '44', suffix: 'th', label: 'In the engineering category', source: 'NIRF, MHRD' },
    { value: '83', suffix: 'rd', label: 'Among all institutions in India', source: 'NIRF, MHRD' },
  ],
};

export const links = {
  razorpay: 'https://rzp.io/rzp/apexracingfundraising',
  instagram: 'https://www.instagram.com/apexracing_ssn/',
  instagramHandle: '@apexracing_ssn',
  linkedin: 'https://www.linkedin.com/in/apex-racing-team/',
  /** No team address has been confirmed yet. Set it and the email buttons appear. */
  email: null as string | null,
};

export type Contact = {
  name: string;
  role: string;
  phone: string;
  tel: string;
  whatsapp: string;
};

export const contacts: Contact[] = [
  {
    name: 'Krtin Narayanan',
    role: 'Team Captain',
    phone: '+91 73583 81378',
    tel: '+917358381378',
    whatsapp: '917358381378',
  },
  {
    name: 'Paul J',
    role: 'Management Head',
    phone: '+91 93444 52833',
    tel: '+919344452833',
    whatsapp: '919344452833',
  },
  {
    name: 'Abilash Padmashankar',
    role: 'Corporate Partnerships',
    phone: '+91 96009 62404',
    tel: '+919600962404',
    whatsapp: '919600962404',
  },
];

/** The one we point partnership enquiries at first. */
export const partnershipContact = contacts[2];

/* ------------------------------------------------------------------ boot */

export const boot = {
  tips: [
    'The chassis is AISI 4130 chromoly. About twice as strong as the tube on our last kart.',
    'The kart stops in 3 metres.',
    '60 volts, 120 amp hours. That is the pack sitting behind a 6 kW motor.',
    'We were Apex Racing before Hollywood came up with APXGP.',
    'Our telemetry reaches the pit wall from up to 10 km away.',
    'First season on electric. P1 in acceleration.',
  ],
  cta: 'PRESS START',
  hint: 'Press Enter, or tap anywhere',
};

/* ------------------------------------------------------------------ hero */

export const hero = {
  /** Two strips of HUD text that frame the top of the screen. */
  eyebrowLeft: 'FKDC 2025 \u00B7 SEASON 9 \u00B7 KARI MOTOR SPEEDWAY',
  eyebrowRight: 'ZERO FUEL. ALL CURRENT.',
  word: ['Apex', 'Racing'],
  headline: ['ENGINEERED BY', 'STUDENTS.'],
  sub:
    'SSN College of Engineering\u2019s electric karting team. We design the kart, weld the frame, wire the pack and drive it. In Chennai, on a student budget.',
  primary: { label: 'BOX BOX: PARTNER WITH US', href: '#partner' },
  secondary: { label: 'ENTER GARAGE', href: '#garage' },
  tertiary: { label: 'FUND THE BUILD \u00B7 RAZORPAY', href: links.razorpay },
  fundNote: 'No company needed. Any amount, one tap.',
  kartAlt:
    'The Apex Racing electric kart photographed head on, number 05 on its nose plate and an SSN sticker on the front bumper.',

  /** The card strip along the bottom of the screen. */
  cards: [
    {
      kind: 'results' as const,
      label: 'FKDC 2025 \u00B7 FIRST EV SEASON',
      rows: [
        { pos: 'P1', event: 'Acceleration' },
        { pos: 'P2', event: 'Skid pad' },
      ],
      spark: [28, 41, 36, 58, 71, 62, 84, 96, 88, 72, 64, 79, 91, 100, 86, 68, 77, 59, 66, 48],
    },
    {
      kind: 'volts' as const,
      label: 'POWERTRAIN \u00B7 FULLY ELECTRIC',
      big: '6',
      unit: 'kW',
      name: 'PMSM',
      rows: [
        { k: 'Pack', v: '60 V / 120 Ah' },
        { k: 'Peak torque', v: '79.22 Nm' },
      ],
    },
    {
      kind: 'specs' as const,
      label: 'THE KART',
      rows: [
        { k: 'Frame', v: '4130', u: 'CHROMOLY' },
        { k: 'Stops in', v: '3 m', u: 'TESTED' },
        { k: 'Turns in', v: '3 m', u: 'RADIUS' },
      ],
      spark: [18, 26, 30, 38, 44, 41, 52, 58, 66, 61, 74, 81, 77, 88, 92, 86, 94, 89, 96, 90],
    },
    {
      kind: 'awards' as const,
      label: 'ON THE SHELF',
      items: ['Innovation Award', 'Go Green Award'],
      note: 'COMBUSTION ERA',
      confirm: true,
    },
    {
      kind: 'roadmap' as const,
      label: 'WHERE THIS GOES',
      stops: [
        { name: 'FKDC', state: 'here' as const },
        { name: 'SUPRA', state: 'next' as const },
        { name: 'FORMULA BHARAT', state: 'later' as const },
      ],
      confirm: true,
    },
  ],
};

export const ticker = [
  'P1 ACCELERATION · FKDC 2025',
  'P2 SKID PAD',
  '6 kW PMSM',
  '60 V · 120 Ah',
  'AISI 4130 CHROMOLY',
  'STOPS IN 3 m',
  'LoRa TELEMETRY · 10 km',
  'NEXT: SUPRA',
  'RAZORPAY OPEN',
];

/* ---------------------------------------------------------------- career */

export type Season = Confirmable & {
  slot: string;
  year: string;
  title: string;
  tag: string;
  body: string;
  stats?: { k: string; v: string }[];
  photo?: string;
  locked?: boolean;
  lockNote?: string;
};

export const career: Season[] = [
  {
    slot: 'SAVE 01',
    year: '2023',
    title: 'IKR',
    tag: 'COMBUSTION',
    body:
      'An early outing in the combustion category. The kart ran number 16 and most of the frame was cut, welded and fettled on campus.',
    stats: [
      { k: 'Kart', v: '#16' },
      { k: 'Class', v: 'IC' },
    ],
    photo: 'ikr-team',
    confirm: true,
  },
  {
    slot: 'SAVE 02',
    year: 'IC ERA',
    title: 'PRECISIO',
    tag: 'COMBUSTION',
    body:
      'Before the rename we raced as Precisio. The kart carried number 41 and the name across its nose. That car won us an Innovation Award and a Go Green Award in the IC category.',
    stats: [
      { k: 'Kart', v: '#41' },
      { k: 'Awards', v: '2' },
    ],
    photo: 'precisio-track',
    confirm: true,
  },
  {
    slot: 'SAVE 03',
    year: '2024',
    title: 'GKDC',
    tag: 'COMBUSTION',
    body:
      'Another national karting event, still on petrol. It is the last season we ran a combustion kart, and the one that convinced us to change everything.',
    stats: [{ k: 'Class', v: 'IC' }],
    photo: 'gkdc-kart',
    confirm: true,
  },
  {
    slot: 'SAVE 04',
    year: '2025',
    title: 'GOING ELECTRIC',
    tag: 'THE REBUILD',
    body:
      'New name, new class, new everything. We moved the frame to AISI 4130 chromoly, designed a 6 kW electric drivetrain around a 60 V pack, and built our own telemetry to watch it work.',
    stats: [
      { k: 'Frame', v: '4130' },
      { k: 'Motor', v: '6 kW' },
    ],
    photo: 'battery-fit',
  },
  {
    slot: 'SAVE 05',
    year: 'OCT 2025',
    title: 'FKDC 2025',
    tag: 'SEASON 9 · KARI MOTOR SPEEDWAY',
    body:
      'Our first year racing electric. We took P1 in acceleration and P2 in the skid pad. Endurance is where it came apart, and we have been rebuilding around that ever since.',
    stats: [
      { k: 'Accel', v: 'P1' },
      { k: 'Skid pad', v: 'P2' },
    ],
    photo: 'fkdc-banner',
  },
  {
    slot: 'SAVE 06',
    year: '2026',
    title: 'THIS SEASON',
    tag: 'IN PROGRESS',
    body:
      'The 2026 build is underway. Four departments, one kart, and a workshop we are trying to get off the ground.',
    stats: [{ k: 'Status', v: 'LIVE' }],
    photo: 'garage-night',
    confirm: true,
  },
  {
    slot: 'LOCKED',
    year: 'NEXT',
    title: 'SUPRA SAEINDIA',
    tag: 'FORMULA STUDENT',
    body:
      'A full Formula Student car. A real step up in engineering, budget and ambition.',
    locked: true,
    lockNote: 'Unlocks with the right partners.',
    confirm: true,
  },
  {
    slot: 'LOCKED',
    year: 'AFTER',
    title: 'FORMULA BHARAT',
    tag: 'EV CLASS',
    body: 'India’s Formula Student event, with an electric class we are built for.',
    locked: true,
    lockNote: 'Unlocks with the right partners.',
    confirm: true,
  },
];

export const funFact = {
  front: 'FUN FACT',
  backTitle: 'WE HAD THE NAME FIRST',
  back:
    'We were Apex Racing years before the 2025 F1 film made up a team called APXGP. Ours has real welds.',
};

/* ---------------------------------------------------------------- replay */

export type ReplayCard = Confirmable & {
  kicker: string;
  big?: string;
  title: string;
  body: string;
  photo?: string;
  cta?: { label: string; href: string };
};

export const replay: ReplayCard[] = [
  {
    kicker: 'FKDC 2025 · SEASON 9',
    title: 'Our first year racing electric.',
    body: 'Kari Motor Speedway, October 2025. New class, new kart, same team.',
    photo: 'fkdc-banner',
  },
  {
    kicker: 'ACCELERATION',
    big: 'P1',
    title: 'Fastest off the line.',
    body: 'First place in the acceleration run, in our first season on electric power.',
    photo: 'driver-onboard',
  },
  {
    kicker: 'SKID PAD',
    big: 'P2',
    title: 'Second in the skid pad.',
    body: 'A 3 metre turning radius and 95% Ackermann geometry, doing exactly what it was drawn to do.',
    photo: 'skidpad-night',
  },
  {
    kicker: 'ENDURANCE',
    title: 'This is the part we do not skip over.',
    body:
      'Endurance did not go our way. Without it, we were in the fight for the top three overall.',
    photo: 'kart-09-dark',
    confirm: true,
  },
  {
    kicker: 'BUILT IN HOUSE',
    big: '100%',
    title: 'Every part of it is ours.',
    body:
      'Frame designed in SolidWorks and analysed in ANSYS. Drivetrain specified, sourced and integrated by students. Telemetry written by students. Nothing bought off a shelf and badged.',
    photo: 'fkdc-pit-work',
  },
  {
    kicker: 'NEXT SEASON',
    title: 'Your logo could be on the kart that fixes it.',
    body:
      'We know what let us down and we know what it costs to put right. Come and build that with us.',
    cta: { label: 'BUILD YOUR PARTNERSHIP', href: '#partner' },
  },
];

/* ---------------------------------------------------------------- garage */

export type Part = {
  id: string;
  name: string;
  label: string;
  /** percentage position of the hotspot over the isometric render */
  x: number;
  y: number;
  specs: { k: string; v: string }[];
  plain: string;
};

export const garageParts: Part[] = [
  {
    id: 'motor',
    name: 'Motor',
    label: '6 kW PMSM',
    x: 24,
    y: 66,
    specs: [
      { k: 'Type', v: 'Permanent magnet synchronous' },
      { k: 'Rated power', v: '6 kW' },
      { k: 'Rated torque', v: '17.12 Nm' },
      { k: 'Peak torque', v: '79.22 Nm' },
      { k: 'Efficiency', v: 'Above 88% at full load' },
      { k: 'Cooling', v: 'Forced air, IP67' },
    ],
    plain:
      'The thing that actually turns the wheels. Peak torque is nearly five times its rated figure, which is why the kart leaves the line the way it does.',
  },
  {
    id: 'battery',
    name: 'Battery',
    label: '60 V · 120 Ah',
    x: 33,
    y: 38,
    specs: [
      { k: 'Chemistry', v: 'Lithium ion' },
      { k: 'Nominal voltage', v: '60 V' },
      { k: 'Capacity', v: '120 Ah' },
      { k: 'Range', v: '40 to 50 km under race conditions' },
      { k: 'BMS', v: 'Thermal, overcurrent, short circuit' },
    ],
    plain:
      'The pack and its management system. The BMS watches temperature and current and cuts power before anything gets dangerous.',
  },
  {
    id: 'controller',
    name: 'Controller',
    label: '60 V HEAVY DUTY',
    x: 45,
    y: 52,
    specs: [
      { k: 'Type', v: '60 V heavy duty PMSM controller' },
      { k: 'Modes', v: '3 speed modes' },
      { k: 'Braking', v: 'Regenerative' },
      { k: 'Reverse', v: 'At full and low rpm' },
      { k: 'Protection', v: 'Overheat, over current, throttle error, hall sensor' },
    ],
    plain:
      'The brain between the pedal and the motor. It also puts energy back into the pack when the driver lifts.',
  },
  {
    id: 'chassis',
    name: 'Chassis',
    label: 'AISI 4130',
    x: 60,
    y: 83,
    specs: [
      { k: 'Material', v: 'AISI 4130 chromoly' },
      { k: 'Ultimate tensile', v: '560 MPa' },
      { k: 'Wheelbase', v: '55 in' },
      { k: 'Length · width', v: '80 in · 60 in' },
      { k: 'Ground clearance', v: '1 in' },
      { k: 'Analysis', v: 'SolidWorks, ANSYS FEA' },
    ],
    plain:
      'The frame everything bolts to. Chromoly is roughly twice as strong as the tube on our previous kart, and it was tested in simulation for front, side and rear impacts before anyone cut steel.',
  },
  {
    id: 'brakes',
    name: 'Brakes',
    label: 'STOPS IN 3 m',
    x: 36,
    y: 77,
    specs: [
      { k: 'Disc and caliper', v: 'Bajaj Pulsar RS200' },
      { k: 'Fluid', v: 'DOT 4' },
      { k: 'Braking torque', v: '501.1 Nm' },
      { k: 'Stopping distance', v: '3 m' },
      { k: 'Deceleration', v: '20.52 m/s²' },
    ],
    plain:
      'Road bike hardware, chosen because it is strong, cheap and easy to get in Chennai. It stops the kart in three metres. We tested that more times than we would like to admit.',
  },
  {
    id: 'steering',
    name: 'Steering',
    label: '95% ACKERMANN',
    x: 62,
    y: 12,
    specs: [
      { k: 'Type', v: 'Ackermann four bar' },
      { k: 'Turning radius', v: '3 m' },
      { k: 'Ratio', v: '3:1' },
      { k: 'Ackermann', v: '95%' },
      { k: 'Column', v: 'Collapsible' },
    ],
    plain:
      'The geometry that makes the inside wheel turn harder than the outside one, so the kart pivots cleanly instead of scrubbing. The column collapses in an impact.',
  },
  {
    id: 'telemetry',
    name: 'Telemetry',
    label: 'LoRa · 10 km',
    x: 78,
    y: 33,
    specs: [
      { k: 'Radio', v: 'ESP32 with SX1276 LoRa' },
      { k: 'GPS', v: 'u-blox ZED-F9P RTK' },
      { k: 'Sensors', v: 'DS18B20, ACS712, MPU6050' },
      { k: 'Range', v: '2 to 10 km' },
      { k: 'Safety', v: 'Physical and wireless emergency stop' },
    ],
    plain:
      'Our own system. It sends motor temperature, battery current, driver inputs and centimetre accurate position back to the pit, live, from up to ten kilometres away.',
  },
];

/** FKDC 2025 build costs, from the business plan submitted with the design report. */
export const partsShop: Confirmable & {
  total: string;
  note: string;
  items: { name: string; cost: string; lane: string }[];
} = {
  total: '₹3,77,000',
  note: 'FKDC 2025 build. The 2026 numbers are being put together now.',
  confirm: true,
  items: [
    { name: 'Motor', cost: '₹78,000', lane: 'powertrain' },
    { name: 'Battery', cost: '₹95,000', lane: 'powertrain' },
    { name: 'Chassis and fabrication', cost: '₹50,000', lane: 'garage' },
    { name: 'Tyres, steering and braking', cost: '₹40,000', lane: 'grid' },
    { name: 'Electronics and safety', cost: '₹35,000', lane: 'powertrain' },
    { name: 'Raw materials', cost: '₹16,000', lane: 'garage' },
    { name: 'Logistics', cost: '₹20,000', lane: 'grid' },
    { name: 'Competition entry', cost: '₹43,000', lane: 'grid' },
  ],
};

/* ------------------------------------------------------------- telemetry */

export const telemetry = {
  caption:
    'We built our own telemetry. The kart talks to the pit from up to 10 km away with centimetre level GPS. Motor temperature, battery current and driver inputs, live.',
  hardware: [
    { k: 'RADIO', v: 'ESP32 + SX1276' },
    { k: 'GPS', v: 'u-blox ZED-F9P RTK' },
    { k: 'TEMP', v: 'DS18B20' },
    { k: 'CURRENT', v: 'ACS712' },
    { k: 'IMU', v: 'MPU6050' },
  ],
  cta: { label: 'PARTNER THE TECH', href: '#partner' },
};

/* ------------------------------------------------------------------ crew */

export type Department = {
  id: string;
  name: string;
  line: string;
  stat: string;
};

export const departments: Department[] = [
  {
    id: 'powertrain',
    name: 'POWERTRAIN',
    line: 'Motor, controller and battery management, integrated into one drivetrain.',
    stat: '6 kW · 60 V · 120 Ah',
  },
  {
    id: 'chassis',
    name: 'CHASSIS',
    line: 'Frame design and development. Stronger, stiffer, lighter, inside the rules.',
    stat: 'AISI 4130 · FEA VERIFIED',
  },
  {
    id: 'steering',
    name: 'STEERING & BRAKES',
    line: 'Suspension, steering geometry and wheel assembly for stability and precise handling.',
    stat: '3 m RADIUS · 3 m STOP',
  },
  {
    id: 'management',
    name: 'MANAGEMENT',
    line: 'Sponsorships, sourcing, procurement, design, social, finance and logistics.',
    stat: 'THE PART THAT PAYS FOR IT',
  },
];

export const quotes: (Confirmable & { name: string; role: string; text: string })[] = [
  {
    name: 'Krtin Narayanan',
    role: 'Team Captain',
    text:
      'We build karts that are fast because they are efficient. Every design call this season came from that.',
    confirm: true,
  },
  {
    name: 'Paul J',
    role: 'Management Head',
    text:
      'Karting was the start. Supra is next. We are building a team that outlasts any one batch of students, and a name that means something in Tamil Nadu racing.',
    confirm: true,
  },
];

/* --------------------------------------------------------------- partner */

export type Lane = {
  id: string;
  name: string;
  builds: string;
  spot: string;
  /** which part of the kart graphic lights up */
  zone: 'nose' | 'pod' | 'rear' | 'shirt' | 'report';
  gets: string[];
};

export const lanes: Lane[] = [
  {
    id: 'front-row',
    name: 'FRONT ROW PARTNER',
    builds: 'The whole season. Our lead partner.',
    spot: 'Front nose, on its own',
    zone: 'nose',
    gets: [
      'Your logo on the kart’s front nose, the most visible spot, separate from everyone else',
      'The biggest logo on our team shirts',
      'Your logo on every official report we submit, design report and business plan',
      'Your logo in the corner of every video we post',
      'Dedicated posts on our social channels',
      'Priority at SSN college events, including flyers and stalls',
      'Anything else you ask for that stays inside college rules',
    ],
  },
  {
    id: 'powertrain',
    name: 'POWERTRAIN PARTNER',
    builds: 'The motor, the controller or the battery pack.',
    spot: 'Side pods, and the part itself',
    zone: 'pod',
    gets: [
      'Your name on the part you funded and on both side pods',
      'Your logo on team shirts',
      'Dedicated posts about the build of that system',
      'Your logo on our videos',
    ],
  },
  {
    id: 'garage',
    name: 'GARAGE PARTNER',
    builds: 'Our first real workshop. The space that makes Supra possible.',
    spot: 'Workshop wall and side pods',
    zone: 'pod',
    gets: [
      'Naming on the workshop wall, subject to college approval',
      'Your logo on team shirts',
      'Dedicated posts through the build season',
      'A full season report at the end of the year',
    ],
  },
  {
    id: 'grid',
    name: 'GRID PARTNER',
    builds: 'Getting us to the track. Transport, entry fees, tyres, consumables.',
    spot: 'Kart sides and rear bumper',
    zone: 'rear',
    gets: [
      'Your logo on the sides of the kart',
      'Your logo on team shirts',
      'Social posts from national events',
      'Media reach from the events we enter',
    ],
  },
  {
    id: 'pit-crew',
    name: 'PIT CREW',
    builds: 'In kind support. Tools, materials, fabrication, services or space.',
    spot: 'Matched to the equivalent lane',
    zone: 'shirt',
    gets: [
      'Value matched to the equivalent cash lane',
      'Your logo on the kart and on team shirts',
      'Credit in every post about the thing you supplied',
    ],
  },
  {
    id: 'fan',
    name: 'FAN & ALUMNI FUND',
    builds: 'Any amount, straight through Razorpay.',
    spot: 'Supporters wall',
    zone: 'report',
    gets: [
      'Your name on the supporters wall on this site',
      'A thank you post each season',
      'The season report, same as everyone else',
    ],
  },
];

/**
 * The Razorpay ask. This is the one thing an individual can act on in a
 * single tap, so it gets its own band inside Partner Setup, a pill in the
 * HUD, and a repeat on the Pit Wall.
 */
export const fund = {
  kicker: 'NO MEETING NEEDED',
  title: 'FUND THE BUILD',
  lead: 'Any amount, straight to the team, through Razorpay.',
  body:
    'You do not need a company or a contract. Alumni, parents and anyone who likes what we are doing can put in whatever they want, right now, and it goes into this season’s kart.',
  cta: 'OPEN RAZORPAY',
  scan: 'SCAN TO CONTRIBUTE',
  short: 'FUND THE BUILD',
  nudges: [
    { amount: 'A few hundred', buys: 'Consumables for a test day' },
    { amount: 'A few thousand', buys: 'Tyres, fluids, fasteners' },
    { amount: 'More than that', buys: 'A named part on the kart' },
  ],
  nudgesConfirm: true,
};

export const partnerIntro = {
  screen: 'PARTNER SETUP',
  headline: 'PICK WHAT YOU WANT TO BUILD.',
  body:
    'We are college students. We cannot give you a stadium. We can put your name on a kart that races, on the people who build it, and in every report we submit. And we will show you where every rupee went.',
  everyone: [
    'A marketing and R&D report at the end of the season',
    'A memento and a certificate of appreciation from the college',
    'A mention in the college magazine',
  ],
  everyoneConfirm: true,
  smallprint:
    'Every partner gets a marketing and R&D report at the end of the season. You will see exactly where your support went.',
  inKind: {
    label: 'Got tools, materials or space instead of cash?',
    body:
      'Works for us. We value what you supply against the equivalent lane and you get the same treatment.',
  },
  noPrices:
    'We do not publish numbers. Tell us what you want to build and we will tell you what it costs.',
};

/* --------------------------------------------------------------- paddock */

export type Partner = { slug: string; name: string };

export const pastPartners: Partner[] = [
  { slug: 'atlaa-tech', name: 'Atlaa Tech' },
  { slug: 'sarvamangala', name: 'Sarvamangala Diagnostic Centre' },
  { slug: 'indra-foods', name: 'Indra Foods' },
  { slug: 'niyamita', name: 'Niyamita' },
  { slug: 'ibusinesslabs', name: 'iBusinessLabs' },
  { slug: 'jeeva-coffee', name: 'Jeeva Coffee' },
  { slug: 'aditya', name: 'Aditya Infrastructure' },
  { slug: 'bharath', name: 'Bharath Transport' },
];

export const paddock = {
  line:
    'These businesses put us on the grid. Most of them backed a team with no EV kart and no results yet. We do not forget that.',
  emptySpot: 'This spot is open.',
};

/* ---------------------------------------------------------------- photos */

export const photoFilters = [
  { id: 'all', label: 'ALL' },
  { id: 'track', label: 'TRACK' },
  { id: 'garage', label: 'GARAGE' },
  { id: 'crew', label: 'CREW' },
  { id: 'events', label: 'EVENTS' },
];

/* -------------------------------------------------------------- pit wall */

export const pitwall = {
  headline: 'LET’S BUILD IT TOGETHER.',
  sub:
    'Call one of us, message us, or put something in through Razorpay. All three reach the same three people.',
  credits: 'Built by the team. Photos by the team.',
};

/* -------------------------------------------------------- HUD / sections */

export type Screen = {
  id: string;
  num: string;
  name: string;
  short: string;
  /** shown in the slim pill nav */
  inNav: boolean;
};

export const screens: Screen[] = [
  { id: 'hero', num: '01', name: 'MAIN MENU', short: 'MENU', inNav: false },
  { id: 'career', num: '02', name: 'CAREER MODE', short: 'CAREER', inNav: true },
  { id: 'replay', num: '03', name: 'RACE REPLAY', short: 'REPLAY', inNav: true },
  { id: 'garage', num: '04', name: 'GARAGE', short: 'GARAGE', inNav: true },
  { id: 'telemetry', num: '05', name: 'TELEMETRY', short: 'TELEMETRY', inNav: false },
  { id: 'crew', num: '06', name: 'CREW SELECT', short: 'CREW', inNav: true },
  { id: 'partner', num: '07', name: 'PARTNER SETUP', short: 'PARTNER', inNav: false },
  { id: 'paddock', num: '08', name: 'PADDOCK', short: 'PADDOCK', inNav: true },
  { id: 'photos', num: '09', name: 'PHOTO MODE', short: 'PHOTOS', inNav: false },
  { id: 'pitwall', num: '10', name: 'PIT WALL', short: 'PIT WALL', inNav: false },
];
