/**
 * WEDDING INFO
 * 
 * This file now imports from the centralized configuration.
 * To customize, edit /config/website.config.ts and /config/content.config.ts
 */

import { WeddingCouple, TimelineEvent } from '@/types';
import { websiteConfig } from '@/config/website.config';
import { contentConfig } from '@/config/content.config';

export const weddingInfo: WeddingCouple = {
  bride: {
    name: websiteConfig.couple.bride.name,
    fullName: websiteConfig.couple.bride.fullName,
    photo: websiteConfig.couple.bride.photo,
  },
  groom: {
    name: websiteConfig.couple.groom.name,
    fullName: websiteConfig.couple.groom.fullName,
    photo: websiteConfig.couple.groom.photo,
  },
  weddingDate: new Date(websiteConfig.wedding.date),
  venue: {
    name: websiteConfig.wedding.venue.name,
    address: websiteConfig.wedding.venue.address,
    coordinates: websiteConfig.wedding.venue.coordinates,
  },
};

// Import timeline from content config
export const relationshipTimeline: TimelineEvent[] = contentConfig.timeline as TimelineEvent[];

// Legacy timeline data (kept for backward compatibility, but use contentConfig.timeline instead)
const legacyTimeline: TimelineEvent[] = [
  {
    id: '1',
    date: new Date('2018-03-14'),
    title: 'The Beginning',
    description: 'I still remember the day we first met — after countless messages, endless laughter, and late-night talks, we finally decided to meet at the place you suggested — Udupi. I tried to look my best for you, but the moment I saw you, I knew nothing could ever match how effortlessly beautiful you looked that day. We talked, we laughed, and you paid (something I’ll never forget 😄). Who would’ve thought that a simple meeting over dosa and chowmein would turn into something so incredibly beautiful? And today, as we stand on the edge of forever with our wedding ahead, I feel the same butterflies, the same warmth — just like that very first day. ❤️',
    image: '/images/timeline/first-meeting.jpg',
    // audioMessage: '/audio/timeline/first-meeting.mp3',
    location: {
      name: 'Udupi Restaurant, Delhi',
      coordinates: {
        lat: 28.64231564795343,
        lng: 77.17879674595403,
      },
    },
  },
  {
    id: '2',
    date: new Date('2018-09-15'),
    title: 'Birthdays Specials',
    description: 'Over the years, we’ve celebrated so many birthdays together — each one a chapter of our story, filled with laughter, love, and a few adorable fights. I still remember how you’d get angry when I went out with my friends instead of being with you — and honestly, even that felt special, because it showed how much we meant to each other.You’ve given me gifts that I’ll cherish forever — from the sweet surprises to that Relationship Contract you made me sign, listing all those romantic promises that made me smile like an idiot. We’ve thrown parties that turned into memories we’ll never forget, some nights we even drank till we couldn’t remember how the night ended — but we always remembered how happy we were together.I’ve loved sending you cakes — the personalized ones, the photo cakes, each one a small piece of my love for you. And I’ll never forget your first birthday with me — when I gifted you that personalized website, marking the beginning of our beautiful journey together.And now, as we step into this new chapter — our wedding, our forever — I wanted to gift you something just as special, something that celebrates us. This website is my way of reliving every moment, every memory, and every birthday we’ve shared — a small digital home for our love story that keeps growing, year after year. ❤️',
    image: '/images/timeline/birthday.jpg',
    // audioMessage: '/audio/timeline/birthday.mp3',
    location: {
      name: 'Birthday Celebration',
      coordinates: {
        lat: 28.554677789156507,
        lng: 77.19413727828321,
      },
    },
  },
  {
    id: '3',
    date: new Date('2019-06-20'),
    title: 'Our Trips',
    description: 'Our first trip — Mcleodganj — will always have a special place in my heart. It was new, exciting, and somehow felt so effortlessly us. I can still picture us sitting at Shiva Café, lost in the mountains, getting high and talking for hours, surrounded by that calm, scenic beauty. That moment felt like freedom — just you, me, and the mountains.And how can I forget our hilarious adventure with that scooty? We were so convinced something was wrong with it — turns out it was just us 😄. We even tried the handcuffs for the first time there 🙈, and somehow that trip became the perfect mix of romance, laughter, and mischief.It still makes me laugh that during the whole trip, we never managed to go for the Triund trek because we were so deep in our honeymoon phase — sleeping by 4 p.m. every day, completely lost in our own little world. I even went paragliding for the first time with you — flying above the mountains, with my favorite person by my side.Since then, we’ve had so many more beautiful journeys — Manali, Kasauli, Kasol, Tosh, Nainital — each one with its own memories, laughter, and love. Every place felt more special because you were with me.You’ve always been my perfect travel partner — my passenger princess, who somehow makes every ride feel like an adventure. I can’t wait to explore countless new places with you, create new stories, and keep getting lost in the world — as long as I have you by my side. ❤️',
    image: '/images/timeline/nanital-3.jpg',
    // audioMessage: '/audio/timeline/trips.mp3',
    location: {
      name: 'Summer Getaway',
      coordinates: {
        lat: 29.384595887804977,
        lng: 79.45903224791134,
      },
    },
  },
  {
    id: '4',
    date: new Date('2019-12-31'),
    title: 'Parties and Fun Times',
    description: 'I’ve always loved partying — the music, the laughter, the chaos — and I always dreamed of having a partner who could enjoy it all with me. With you, Kaanzar, that dream came true. With you, every day feels like a party.You make me laugh endlessly, and even though I’m not the best dancer, you somehow make me look less stupid on the dance floor. I love our drunk dances, the carefree spins, the laughter that follows every step. And that night when you did that seductive surprise dance for me — I still get goosebumps thinking about it. It was exhilarating in every way.I haven’t seen your drunk side too many times, but whenever I have — those nights turned into unforgettable memories. Whether it was you stealing people’s drinks while they came to me complaining, “Bhai teri bandi hume peene nahi de rahi,” or crying “Mujhe mummy ke paas jaana hai” after throwing up — every moment was chaotic, funny, and so full of love.We’ve partied with friends, and we’ve partied alone — but as long as you were there, I never felt like anything was missing. Maybe just one little complaint — I still want you to drink a bit more freely with me next time 😉. But honestly, we’ve shared so many joints, laughs, and moments together that every party with you feels perfect already.I love clicking those silly drunk pictures, making high selfie videos, and writing shayaris for you in our intoxicated poetic moods. You’re my favorite person to lose track of time with, my partner in chaos, laughter, and rhythm.When I think about all our parties, it just makes me smile — because every one of them was filled with joy, madness, and love. And my only wish is that this party never ends — as long as we’re together. ❤️',
    image: '/images/timeline/party.jpg',
    // audioMessage: '/audio/timeline/parties.mp3',
    location: {
      name: 'New Year Celebration',
      coordinates: {
        lat: 28.39772678718207,
        lng: 77.07188259386979,
      },
    },
  },
  {
    id: '5',
    date: new Date('2020-08-10'),
    title: 'Our Home — Amarpali S1001',
    description: 'When I think about all the beautiful memories we’ve created together, one phase that will always stand out is our time at Amarpali S1001. That little flat wasn’t just a place — it was a feeling. It gave us our first real taste of living together, of sharing a space that truly felt like home.I’ll never forget the first surprise I planned for you there — decorating the room for our first night out together. The way your eyes lit up when you walked in, that mix of surprise and happiness on your face — it’s a moment I’ll always hold close. And that watch I gifted you, the one I knew you loved — it made the evening even more special.That night, we also drank properly for the first time — and what a night that turned out to be! You getting drunk, me trying to manage the chaos, taking care of you and the whole house — it’s a memory that still makes me smile every time I think of it.Living together there was pure magic. From cooking meals side by side, to our grocery runs where we somehow turned even shopping into fun. We created our favorite little spots around the market, and somehow every corner of that society became a memory.And yes — those mischievous moments in Mangla’s room 🙈, our late-night parties, the night we came back drunk and sat by the pool talking about everything and nothing… it all feels like a dream. I still remember our “paneer wars” — you, with your perfectly chosen ingredients, and me making do with what’s left — yet somehow declaring myself the winner 😄.Those days in that apartment were special. They made me realize that this — the comfort, the laughter, the chaos, and your presence — is exactly what I want for the rest of my life. When we left that flat for the last time, I was emotional — not because we were leaving a place, but because I knew I’d miss that phase, that version of us.But deep down, I know that living together now, as we start this new chapter, will be a thousand times better — because this time, it won’t just be a flat. It will be our forever home. And I can’t wait to relive that warmth, that comfort, and that love — every single day with you. ❤️',
    image: '/images/timeline/our-flat.jpg',
    // audioMessage: '/audio/timeline/our-home.mp3',
    location: {
      name: 'Our First Home',
      coordinates: {
        lat: 28.569439545280503,
        lng: 77.38062584320313,
      },
    },
  },
  {
    id: '6',
    date: new Date('2021-10-15'),
    title: 'Our Weekend Getaways',
    description: 'If there’s one thing that has kept our story alive and glowing through the years, it’s our weekends together. From the very beginning, we made a little pact — no weekend without each other. No matter how busy life got, we always found a way to meet, to spend time, to make memories. And somehow, those weekends became the heartbeat of our relationship.We’ve spent countless weekends together — from quiet dinners at restaurants when time was short, to spontaneous getaways where we just wanted to be away from everything and everyone. I still laugh remembering that one trip when we were high and got convinced there was a camera hidden inside the TV — and the poor owner was so apologetic while we were just giggling nonstop 😄.Our farmhouse parties were something else altogether — the poolside moments, the drinks, the laughter, the dancing. I still remember playing cricket and badminton with you, and how you looked so adorably competitive, even when you were missing the shuttle or the ball. And then there was that day we went bowling — you trying your best, missing all the pins, and looking so cute doing it.Even when I got those hotel stays from work, you’d still come over every weekend, and somehow we turned even those short stays into something beautiful and unforgettable. Every place, every trip, every night felt special just because you were there.We were always so eager for the weekends — counting down the days till Friday, missing each other by the middle of the week, waiting to escape into our own little world again. Those weekends weren’t just breaks from routine — they were reminders of how much we love being together.And every time I got to hold you close, to kiss you, to be intimate with you — I felt like the luckiest man alive. Having someone as beautiful and loving as you, Kaanzar, made every weekend feel like a dream.These getaways, these stolen escapes — they’ve given us some of our happiest, funniest, and most romantic memories. And as we start this next chapter together, I can’t wait to create many more weekends like that — only now, forever will feel like one endless weekend with you. ❤️',
    image: '/images/timeline/pool-party.jpg',
    // audioMessage: '/audio/timeline/weekend-getaway.mp3',
    location: {
      name: 'Nainital, Uttarakhand',
      coordinates: {
        lat: 28.389131772496924,
        lng: 76.97849731198058,
      },
    },
  },
  {
    id: '7',
    date: new Date('2022-03-20'),
    title: 'Our First International Trip — Thailand',
    description: 'Our first international trip — Thailand — will always hold a very special place in my heart. It was the first time we stepped out into a completely new country together, and every single day of that trip gave me memories I’ll never forget.Exploring the streets of Pattaya with you felt like a dream — everything was so new, so vibrant, and so full of life. We got to experience so many things for the first time together — from those crazy live shows that left us both wide-eyed and laughing, to beachside massages and our relaxing couple spa sessions that made us feel so at peace.I still remember walking with you along the streets of Phi Phi Island — how we danced through those lively lanes, slightly tipsy, making those funny, high-on-life videos. That energy, that happiness — it felt like the world belonged to just us. The island parties, the music, the people — everything felt alive. You were so open, free, and full of excitement that night, and it made me fall for you even more deeply. How you were forching me to hook up with someone😂There were so many unforgettable moments — us getting intimate by the beach under the night sky🙈, the incredible fire shows at Phi Phi, and the thrill of the speedboat rides between islands. I’ll never forget standing by the ferry railing with you, feeling the wind and the sea spray while we laughed, smoked, and watched the waves shimmer.You looked stunning in your bikini which you tried for the first time— I still remember how much fun we had picking it out, trying to find the perfect one for you. Those scooty rides through the islands, the peaceful beachside cottages, and watching sunsets together in silence — every second with you there felt like pure magic.And of course, our little adventures — from the scuba diving day where you decided to skip the main dive but cheered me on, to drinking fresh coconuts at the beach in Pattaya, to dancing like crazy in tuk-tuks on the way back to our hotel — every moment felt so full of life.That trip wasn’t just about the beaches or the parties — it was about us. About sharing new experiences, about laughing without limits, about realizing how perfectly we fit no matter where we are.Thailand gave us memories that we’ll carry forever — wild, funny, beautiful, and real. And it made me even more excited for the life ahead — to explore new places, live through new adventures, and make countless more memories with you. Because no matter where we go, you will always be my favorite adventure. ❤️',
    image: '/images/timeline/first-international-trip.jpg',
    // audioMessage: '/audio/timeline/international-trip.mp3',
    location: {
      name: 'Pattaya & Phi Phi Islands, Thailand',
      coordinates: {
        lat: 7.743799269766847,
        lng: 98.77983342189789,
      },
    },
  },
  {
    id: '8',
    date: new Date('2022-12-24'),
    title: 'The Proposal',
    description: 'This was the most awaited moment of our relationship — the one we both dreamed about for so long. You had been expecting it for months, maybe even years, and we had countless discussions about when and how it might finally happen. I always wanted it to be a surprise — something perfect and unforgettable — while you, being your impatient and adorable self, would get restless before every big moment thinking, “Maybe today’s the day.”I still remember my birthday so clearly — you were so upset that I didn’t propose that day. You didn’t even talk to me properly, not knowing that the ring was actually in my bag the whole time. But I didn’t do it because I wanted your proposal to be something more special — something you’d never forget. And looking back, I’m so glad I waited, because the way it finally happened turned out to be absolutely perfect.Before we shared our relationship with our families, I wanted to give you the moment you truly deserved — to propose to you in the most beautiful way possible. When I got the perfect chance for us to go on a trip to Nainital, I told you it would be our last trip before things got official, and that’s when I knew — this was it.I planned everything in my head. I didn’t drink or smoke the entire day because I wanted the proposal to be flawless. I decided that the top of Naini Peak would be the spot where I’d finally ask you to be mine forever. I even sent you reels before the trip, showing how people wear nice dresses on treks these days, just to make sure you’d dress up — and you did! You looked absolutely stunning that day, makeup and all, even while trekking.The climb wasn’t easy — you got tired, complained a few times, and even said, “Let’s go back.” I was silently panicking inside, thinking my plan might fall apart before we even reached the top. But thankfully, you pushed through, and we made it.We’d met a couple the previous day, and during the trek, I told them my plan — that I was going to propose and needed them to record the video. They agreed, and even though they completely messed up the video, those imperfections just make the memory even more perfect.I had even rehearsed the whole flow of the moment in my head:Me: “How’s the view?”You: “Beautiful.”Me: “Can you think of a way it could become even more beautiful?”You: “No.”Me: “Let me try then.”That’s when I was supposed to go down on one knee and propose. But when I bent down, you panicked and thought I was about to go down the mountain! You grabbed my hand and started saying, “Don’t go down!” — and I remember trying so hard not to laugh while also being nervous as hell.Then I told you calmly, “I’m not doing anything stupid… I’m just doing what you truly deserve out of this relationship.” And then, finally, I went down on one knee, looked into your eyes, and asked you the most awaited question of our lives. You said yes — and that was it. That was the moment everything changed.That weekend, we visited multiple temples — something you really wanted to do — and it felt like the perfect way to start our next chapter together. From that day, we weren’t just lovers; we were fiancés, ready to step into forever.You truly deserve every ounce of happiness in this relationship. And just like that day, I’ll always try to make everything more beautiful, more special, and more full of love — because that’s what you mean to me. ❤️',
    image: '/images/timeline/proposal-1.jpg',
    // audioMessage: '/audio/timeline/proposal.mp3',
    location: {
      name: 'Naini Peak, Nainital',
      coordinates: {
        lat: 29.399510025065087,
        lng: 79.45031112237781,
      },
    },
  },
  {
    id: '9',
    date: new Date('2025-11-12'),
    title: 'Our Wedding Day',
    description: 'And now, the most beautiful chapter of our story begins — our wedding.The day we’ve dreamt about for so long is finally here. We’re not just two people in love anymore — we’re partners for life, ready to build our forever together.As we step into this new journey, I just want you to know one thing — I’ll do everything I can to make your life as peaceful, joyful, and full of love as possible.You’ve given me countless memories, laughter, and warmth — now it’s my turn to make every single day with you feel just as special.Here’s to us, to our love, and to a lifetime of happiness ahead. ❤️',
    image: '/images/timeline/lavi-wedding.jpg',
    // audioMessage: '/audio/timeline/wedding-day.mp3',
    location: {
      name: 'Pitampura, Delhi',
      coordinates: {
        lat: 28.7041,
        lng: 77.1025,
      },
    },
  },
];

// Import schedule from website config
export const weddingSchedule = websiteConfig.wedding.schedule;

// Legacy schedule data (kept for backward compatibility)
const legacySchedule = [
  {
    time: '3:00 PM',
    event: 'Guest Arrival & Cocktail Hour',
    description: 'Welcome drinks and light appetizers in the garden',
  },
  {
    time: '4:00 PM',
    event: 'Wedding Ceremony',
    description: 'Exchange of vows in the rose garden',
  },
  {
    time: '4:30 PM',
    event: 'Cocktail Hour Continues',
    description: 'Photos with the wedding party, more mingling',
  },
  {
    time: '6:00 PM',
    event: 'Reception Dinner',
    description: 'Three-course dinner in the main hall',
  },
  {
    time: '8:00 PM',
    event: 'First Dance & Speeches',
    description: 'Our first dance followed by toasts from family',
  },
  {
    time: '9:00 PM',
    event: 'Dancing & Celebration',
    description: 'Dance the night away with our favorite songs',
  },
  {
    time: '11:00 PM',
    event: 'Send-off',
    description: 'Sparkler send-off under the stars',
  },
];
