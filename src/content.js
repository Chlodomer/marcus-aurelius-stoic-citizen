(function (root, factory) {
  const content = factory();
  if (typeof module === 'object' && module.exports) module.exports = content;
  else root.MarcusContent = content;
})(typeof self !== 'undefined' ? self : this, function () {
  const passages = [
    {
      id: 'i-14', book: 'I', section: '14', citation: 'I.14', scanPage: '11 (PDF 56)',
      title: 'Equality, liberty, and friendship',
      keyboardExcerpt: 'the conception of a state with one law for all, based upon individual equality and freedom of speech, and of a sovranty which prizes above all things the liberty of the subject',
      text: "From my ‘brother’ Severus, love of family, love of truth, love of justice, and (thanks to him!) to know Thrasea, Helvidius, Cato, Dion, Brutus; and the conception of a state with one law for all, based upon individual equality and freedom of speech, and of a sovranty which prizes above all things the liberty of the subject; and furthermore from him also to set a well-balanced and unvarying value on philosophy; and readiness to do others a kindness, and eager generosity, and optimism, and confidence in the love of friends; and perfect openness in the case of those that came in for his censure; and the absence of any need for his friends to surmise what he did or did not wish, so plain was it."
    },
    {
      id: 'i-16', book: 'I', section: '16', citation: 'I.16', scanPage: '13-19 (PDF 58-64)',
      title: 'Antoninus Pius as ruler',
      keyboardExcerpt: 'the spirit of thorough investigation which he shewed in the meetings of his Council, and his perseverance; nay his never desisting prematurely from an enquiry on the strength of off-hand impressions',
      text: "From my Father, mildness, and an unshakable adherence to decisions deliberately come to; and no empty vanity in respect to so-called honours; and a love of work and thoroughness; and a readiness to hear any suggestions for the common good; and an inflexible determination to give every man his due; and to know by experience when is the time to insist and when to desist. And his public spirit; and the spirit of thorough investigation which he shewed in the meetings of his Council, and his perseverance; nay his never desisting prematurely from an enquiry on the strength of off-hand impressions. And his restricting in his reign public acclamations and every sort of adulation; and his unsleeping attention to the needs of the empire, and his wise stewardship of its resources, and his patient tolerance of the censure that all this entailed."
    },
    {
      id: 'i-17', book: 'I', section: '17', citation: 'I.17', scanPage: '19-25 (PDF 64-70)',
      title: 'Court, family, and fortune',
      keyboardExcerpt: 'That I have been blessed with a wife so docile, so affectionate, so unaffected; that I had no lack of suitable tutors for my children.',
      text: "From the Gods, to have good grandfathers, good parents, a good sister, good teachers, good companions, kinsmen, friends—nearly all of them. That I was subordinated to a ruler and a father capable of ridding me of all conceit, and of bringing me to recognize that it is possible to live in a Court and yet do without body-guards and gorgeous garments and linkmen and statues and the like pomp; and that it is in such a man’s power to reduce himself very nearly to the condition of a private individual and yet not on this account to be more paltry or more remiss in dealing with what the interests of the state require to be done in imperial fashion. That I have been blessed with a wife so docile, so affectionate, so unaffected; that I had no lack of suitable tutors for my children."
    },
    {
      id: 'ii-1', book: 'II', section: '1', citation: 'II.1', scanPage: '27 (PDF 72)',
      title: 'Made for co-operation',
      keyboardExcerpt: 'For we have come into being for co-operation, as have the feet, the hands, the eyelids, the rows of upper and lower teeth.',
      text: "Say to thyself at daybreak: I shall come across the busy-body, the thankless, the bully, the treacherous, the envious, the unneighbourly. All this has befallen them because they know not good from evil. But I, in that I have comprehended the nature of the Good that it is beautiful, and the nature of Evil that it is ugly, and the nature of the wrong-doer himself that it is akin to me, not as partaker of the same blood and seed but of intelligence and a morsel of the Divine, can neither be injured by any of them—for no one can involve me in what is debasing—nor can I be wroth with my kinsman and hate him. For we have come into being for co-operation, as have the feet, the hands, the eyelids, the rows of upper and lower teeth. Therefore to thwart one another is against Nature; and we do thwart one another by shewing resentment and aversion."
    },
    {
      id: 'ii-5', book: 'II', section: '5', citation: 'II.5', scanPage: '31 (PDF 76)',
      title: 'A Roman and a man',
      keyboardExcerpt: 'Every hour make up thy mind sturdily as a Roman and a man to do what thou hast in hand with scrupulous and unaffected dignity and love of thy kind and independence and justice',
      text: "Every hour make up thy mind sturdily as a Roman and a man to do what thou hast in hand with scrupulous and unaffected dignity and love of thy kind and independence and justice; and to give thyself rest from all other impressions. And thou wilt give thyself this, if thou dost execute every act of thy life as though it were thy last, divesting thyself of all aimlessness and all passionate antipathy to the convictions of reason, and all hypocrisy and self-love and dissatisfaction with thy allotted share."
    },
    {
      id: 'ii-carnuntum', book: 'II', section: 'Closing note', citation: 'II, closing note', scanPage: '43 (PDF 88)',
      title: 'Place of composition',
      keyboardExcerpt: 'Written at Carnuntum.',
      text: 'Written at Carnuntum.'
    },
    {
      id: 'iii-5', book: 'III', section: '5', citation: 'III.5', scanPage: '53 (PDF 98)',
      title: 'Roman, ruler, and duty',
      keyboardExcerpt: 'Moreover let the god that is in thee be lord of a living creature, that is manly, and of full age, and concerned with statecraft, and a Roman, and a ruler',
      text: "Do that thou doest neither unwillingly nor selfishly nor without examination nor against the grain. Dress not thy thought in too fine a garb. Be not a man of superfluous words or superfluous deeds. Moreover let the god that is in thee be lord of a living creature, that is manly, and of full age, and concerned with statecraft, and a Roman, and a ruler, who hath taken his post as one who awaits the signal of recall from life in all readiness, needing no oath nor any man as his voucher."
    },
    {
      id: 'iii-6', book: 'III', section: '6', citation: 'III.6', scanPage: '55-57 (PDF 100-102)',
      title: 'The better thing',
      keyboardExcerpt: 'If indeed thou findest in the life of man a better thing than justice, than truth, than temperance, than manliness',
      text: "If indeed thou findest in the life of man a better thing than justice, than truth, than temperance, than manliness, and, in a word, than thy mind’s satisfaction with itself in things wherein it shews thee acting according to the true dictates of reason, and with destiny in what is allotted thee apart from thy choice—if, I say, thou seest anything better than this, turn to it with all thy soul and take thy fill of the best, as thou findest it. But if there appears nothing better than the very deity enthroned in thee, which has brought into subjection to itself all individual desires, which scrutinizes the thoughts, and cherishes a fellow-feeling for men—if thou findest everything else pettier and of less account than this, give place to nought else."
    },
    {
      id: 'iv-4', book: 'IV', section: '4', citation: 'IV.4', scanPage: '71-73 (PDF 116-118)',
      title: 'The universe as a state',
      keyboardExcerpt: 'If so, we are citizens. If so, we are fellow-members of an organised community. If so, the Universe is as it were a state',
      text: "If the intellectual capacity is common to us all, common too is the reason, which makes us rational creatures. If so, that reason also is common which tells us to do or not to do. If so, law also is common. If so, we are citizens. If so, we are fellow-members of an organised community. If so, the Universe is as it were a state—for of what other single polity can the whole race of mankind be said to be fellow-members?—and from it, this common State, we get the intellectual, the rational, and the legal instinct."
    },
    {
      id: 'iv-12', book: 'IV', section: '12', citation: 'IV.12', scanPage: '75 (PDF 120)',
      title: 'Reason and the common interest',
      keyboardExcerpt: 'the one which prompts thee to do only what thy reason in its royal and law-making capacity shall suggest for the good of mankind',
      text: "Thou shouldest have these two readinesses always at hand; the one which prompts thee to do only what thy reason in its royal and law-making capacity shall suggest for the good of mankind; the other to change thy mind, if one be near to set thee right, and convert thee from some vain conceit. But this conversion should be the outcome of a persuasion in every case that the thing is just or to the common interest—and some such cause should be the only one—not because it is seemingly pleasant or popular."
    },
    {
      id: 'vi-30', book: 'VI', section: '30', citation: 'VI.30', scanPage: '145-147 (PDF 190-192)',
      title: 'Do not become Caesarified',
      keyboardExcerpt: 'See thou be not Caesarified, nor take that dye, for there is the possibility.',
      text: "See thou be not Caesarified, nor take that dye, for there is the possibility. So keep thyself a simple and good man, uncorrupt, dignified, plain, a friend of justice, god-fearing, gracious, affectionate, manful in doing thy duty. Strive to be always such as Philosophy minded to make thee. Revere the Gods, save mankind. Life is short. This only is the harvest of earthly existence, a righteous disposition and social acts. Do all things as a disciple of Antoninus. Think of his constancy in every act rationally undertaken, his invariable equability, his piety, his serenity of countenance, his sweetness of disposition, his contempt for the bubble of fame, and his zeal for getting a true grip of affairs."
    },
    {
      id: 'vi-44', book: 'VI', section: '44', citation: 'VI.44', scanPage: '155-157 (PDF 200-202)',
      title: 'Rome and the world',
      keyboardExcerpt: 'my city and country, as Antoninus, is Rome; as a man, the world',
      text: "If the Gods have taken counsel about me and the things to befall me, doubtless they have taken good counsel. But if the Gods have taken no counsel for me individually, yet they have in any case done so for the interests of the Universe, and I am bound to welcome and make the best of those things also that befall as a necessary corollary to those interests. It is still in my power to take counsel about myself, and it is for me to consider my own interest. And that is to every man’s interest which is agreeable to his own constitution and nature. But my nature is rational and civic; my city and country, as Antoninus, is Rome; as a man, the world. The things then that are of advantage to these communities, these, and no other, are good for me."
    },
    {
      id: 'x-10', book: 'X', section: '10', citation: 'X.10', scanPage: '271 (PDF 316)',
      title: 'Sarmatians and brigands',
      keyboardExcerpt: 'another on taking wild boars, another bears, another Sarmatians. Are not these brigands, if thou test their principles?',
      text: 'A spider prides itself on capturing a fly; one man on catching a hare, another on netting a sprat, another on taking wild boars, another bears, another Sarmatians. Are not these brigands, if thou test their principles?'
    },
    {
      id: 'x-35', book: 'X', section: '35', citation: 'X.35', scanPage: '289 (PDF 334)',
      title: 'Let my children be safe',
      keyboardExcerpt: 'But the mind that says: Let my children be safe! Let all applaud my every act! is but as an eye that looks for green things or as teeth that look for soft things.',
      text: 'The sound eye should see all there is to be seen, but should not say: I want what is green only. For that is characteristic of a disordered eye. And the sound hearing and smell should be equipped for all that is to be heard or smelled. And the sound digestion should act towards all nutriment as a mill towards the grist which it was formed to grind. So should the sound mind be ready for all that befalls. But the mind that says: Let my children be safe! Let all applaud my every act! is but as an eye that looks for green things or as teeth that look for soft things.',
      note: 'Haines’s printed note links this line to Marcus’s anxiety about Commodus. The note is an editor’s interpretation, not Marcus’s own statement of motive.'
    }
  ];

  const questions = [
    {
      id: 'q1', number: 1, theme: 'Virtue', title: 'The Stoic Standard', art: 'discipline',
      context: 'Marcus repeatedly turns philosophy into a test of conduct. Begin by deciding which demand gives his standard its centre.',
      anchor: ['iii-6'], minimumWords: 40, evidenceRequirement: 0,
      choices: [
        { id: 'justice', label: 'Justice', description: 'Right action toward others is the foundation.' },
        { id: 'self-mastery', label: 'Self-mastery', description: 'Rule over desire and judgment comes first.' },
        { id: 'service', label: 'Service to others', description: 'The social purpose of virtue is decisive.' }
      ],
      branches: {
        justice: { prompt: 'What makes justice the controlling standard in this passage? Identify one phrase in the anchor and explain why self-mastery or service is secondary rather than absent.' },
        'self-mastery': { prompt: 'How does control over desire make the other virtues possible here? Identify one phrase in the anchor and explain why inward discipline is not merely private withdrawal.' },
        service: { prompt: 'Why does fellow-feeling give virtue its purpose in this passage? Identify one phrase in the anchor and explain how service depends on inner discipline.' }
      }
    },
    {
      id: 'q2', number: 2, theme: 'Social obligation', title: 'Made for One Another', art: 'fellowship',
      context: 'Marcus describes difficult people as kin and compares human beings to parts of one body. What kind of obligation follows?',
      anchor: ['ii-1'], minimumWords: 65, evidenceRequirement: 1,
      choices: [
        { id: 'tolerance', label: 'Tolerance', description: 'The first duty is to restrain anger and aversion.' },
        { id: 'cooperation', label: 'Active cooperation', description: 'Human beings must work together like parts of a body.' },
        { id: 'common-good', label: 'The common good', description: 'Action must be directed toward a shared civic end.' }
      ],
      branches: {
        tolerance: { prompt: 'Explain why restraint toward wrongdoers is an active social duty rather than passivity. Add one passage beyond II.1 that supports or complicates this interpretation.' },
        cooperation: { prompt: 'Explain what the bodily comparison requires people to do, not merely feel. Add one passage beyond II.1 that sharpens the meaning of co-operation.' },
        'common-good': { prompt: 'Explain how Marcus moves from kinship to a criterion for public action. Add one passage beyond II.1 that connects fellowship to the common interest.' }
      }
    },
    {
      id: 'q3', number: 3, theme: 'Citizenship', title: 'Two Cities', art: 'cities',
      context: 'Marcus calls Rome his city as Antoninus and the world his city as a man. The relation between those memberships is not self-explanatory.',
      anchor: ['vi-44'], minimumWords: 75, evidenceRequirement: 1,
      choices: [
        { id: 'compete', label: 'They compete', description: 'Imperial and universal duties can pull in different directions.' },
        { id: 'coincide', label: 'They coincide', description: 'Proper service to Rome also serves humanity.' },
        { id: 'hierarchy', label: 'They form a hierarchy', description: 'One citizenship supplies the higher standard for the other.' }
      ],
      branches: {
        compete: { prompt: 'Show where VI.44 leaves room for conflict between Rome’s advantage and the world’s. Add another passage and explain whether it resolves or intensifies the conflict.' },
        coincide: { prompt: 'Explain why Marcus can treat the advantage of Rome and the world as mutually reinforcing. Add another passage that makes this overlap historically plausible within his philosophy.' },
        hierarchy: { prompt: 'Identify which city supplies the higher test and how the other fits beneath it. Add another passage that supports your ordering, and acknowledge one ambiguity.' }
      }
    },
    {
      id: 'q4', number: 4, theme: 'Legitimate rule', title: 'The Model Princeps', art: 'council',
      context: 'In Book I, Marcus remembers Antoninus Pius through habits of rule rather than victories or monuments.',
      anchor: ['i-16'], minimumWords: 95, evidenceRequirement: 2,
      choices: [
        { id: 'deliberation', label: 'Deliberation', description: 'Careful inquiry is the essential ruling habit.' },
        { id: 'moderation', label: 'Moderation', description: 'Restraint toward honour, luxury, and impulse legitimizes power.' },
        { id: 'responsibility', label: 'Responsibility to subjects', description: 'The needs and liberty of the governed supply the test.' }
      ],
      branches: {
        deliberation: { prompt: 'Link two passages to show how inquiry, correction, and patient judgment define the model ruler. Explain why deliberation matters politically, not only personally.' },
        moderation: { prompt: 'Link two passages to show how restraint protects imperial judgment. Explain why private habits count as evidence for Marcus’s idea of legitimate public rule.' },
        responsibility: { prompt: 'Link two passages to show how the ruler’s obligations are measured by the governed. Distinguish Marcus’s ideal criterion from evidence that Antoninus always met it.' }
      }
    },
    {
      id: 'q5', number: 5, theme: 'Imperial self-command', title: 'Do Not Become “Caesarified”', art: 'purple',
      context: 'The metaphor of taking a dye imagines imperial office as something that can alter the person who wears it.',
      anchor: ['vi-30'], minimumWords: 85, evidenceRequirement: 1,
      choices: [
        { id: 'corrupt', label: 'Corrupt character', description: 'Power can stain the ruler’s moral identity.' },
        { id: 'isolate', label: 'Isolate the ruler', description: 'Court and rank can sever ordinary human fellowship.' },
        { id: 'glory', label: 'Replace duty with glory', description: 'Acclamation can displace the work of justice.' }
      ],
      branches: {
        corrupt: { prompt: 'Select exact Haines wording and analyze how the dye metaphor makes corruption a gradual risk. Then identify one phrase that limits or complicates your reading.' },
        isolate: { prompt: 'Select exact Haines wording and explain how becoming Caesarified could separate Marcus from other people. Then test that reading against one passage about court or fellowship.' },
        glory: { prompt: 'Select exact Haines wording and explain the contest between public acclaim and duty. Then show whether Antoninus Pius functions as a real alternative or only an idealized memory.' }
      }
    },
    {
      id: 'q6', number: 6, theme: 'Campaign and conquest', title: 'The Frontier Paradox', art: 'frontier',
      context: 'Marcus wrote while campaigning on the northern frontier. In X.10 he places the capture of Sarmatians in a sequence of hunts and asks whether the victors are brigands.',
      anchor: ['x-10', 'ii-carnuntum'], minimumWords: 105, evidenceRequirement: 1,
      choices: [
        { id: 'moral-doubt', label: 'Private moral doubt', description: 'The comparison exposes unease about his own conduct.' },
        { id: 'martial-glory', label: 'A critique of martial glory', description: 'The target is pride in conquest more than war itself.' },
        { id: 'no-rejection', label: 'No rejection of war itself', description: 'The passage disciplines motive without condemning imperial war.' }
      ],
      branches: {
        'moral-doubt': { prompt: 'Explain what in X.10 permits a reading of private moral doubt. Find complicating evidence and state what the passage cannot establish about Marcus’s policy.' },
        'martial-glory': { prompt: 'Explain how the sequence from spider to Sarmatians reduces the prestige of victory. Find complicating evidence and decide whether the criticism reaches conquest itself.' },
        'no-rejection': { prompt: 'Defend the claim that X.10 does not reject war itself. Find complicating evidence, and explain what moral limit the brigand comparison still places on imperial conduct.' }
      }
    },
    {
      id: 'q7', number: 7, theme: 'Family and detachment', title: '“Let My Children Be Safe”', art: 'family',
      context: 'Marcus treats the wish for his children’s safety as a sign that the mind is demanding only an easy portion of reality. Haines connects the line to anxiety about Commodus.',
      anchor: ['x-35', 'i-17'], minimumWords: 90, evidenceRequirement: 1,
      choices: [
        { id: 'struggle', label: 'An ideal he struggled to meet', description: 'The command answers a real and recurring attachment.' },
        { id: 'disciplined-love', label: 'A disciplined form of love', description: 'Affection remains, but it cannot dictate judgment.' },
        { id: 'contradiction', label: 'A contradiction in the text', description: 'Family love and demanded detachment pull apart.' }
      ],
      branches: {
        struggle: { prompt: 'Use exact wording to show why the line can record struggle rather than achieved calm. Add evidence of family attachment and separate Marcus’s words from Haines’s note.' },
        'disciplined-love': { prompt: 'Explain how Marcus can love his children without making their safety a condition of moral order. Add evidence of attachment and address the severity of the eye-and-teeth comparison.' },
        contradiction: { prompt: 'Define the contradiction precisely rather than merely noting tension. Add evidence from Book I and explain whether a private notebook should be expected to resolve it.' }
      }
    },
    {
      id: 'q8', number: 8, theme: 'Succession and evidence', title: 'The Commodus Problem', art: 'succession',
      context: 'Securely attested: Commodus was Marcus’s biological son, was made Caesar in 166, became co-emperor in 177, and succeeded Marcus in 180. The Meditations never gives a direct explanation of Marcus’s succession decision. Later judgments about Commodus do not by themselves reveal Marcus’s motive.',
      inferenceLabel: 'Historical context distinguishes succession facts from interpretations of motive.',
      anchor: ['i-17', 'x-35'], minimumWords: 180, evidenceRequirement: 2,
      choices: [
        { id: 'attachment', label: 'Dynastic attachment outweighed principle', description: 'Family feeling best explains the decision.' },
        { id: 'stability', label: 'Dynasty served stability', description: 'Marcus may have treated hereditary succession as a public good.' },
        { id: 'unresolved', label: 'The source cannot resolve his motive', description: 'The notebook cannot carry this historical claim.' }
      ],
      branches: {
        attachment: { prompt: 'Build the strongest case that dynastic attachment outweighed Marcus’s principles, using at least two passages already encountered. Then identify the inferential leap and state explicitly what the Meditations cannot prove.' },
        stability: { prompt: 'Build the strongest case that Marcus could regard dynastic succession as service to political stability, using at least two passages already encountered. Then identify the inferential leap and state explicitly what the Meditations cannot prove.' },
        unresolved: { prompt: 'Explain why the Meditations cannot resolve Marcus’s motive while still using at least two passages to define the relevant possibilities. State what additional evidence a historian would need and why later knowledge of Commodus is not enough.' }
      }
    }
  ];

  return {
    title: 'Marcus Aurelius: Emperor, Stoic, Citizen',
    subtitle: 'An interpretive primary-source assignment',
    duration: '60–75 minutes',
    version: '1.0.0',
    passages,
    questions,
    onboarding: [
      {
        title: 'Choices are interpretive forks',
        body: 'This is not a right-or-wrong quiz. Each choice commits you to a historical claim. You will defend it, test it against evidence, and sometimes name its limits.'
      },
      {
        title: 'Read, select, and cite',
        body: 'Open the Source Library to browse or search the verified Haines dossier. Select exact wording or use Add quotation. The app inserts the quotation and citation into your response.'
      },
      {
        title: 'Save here, submit elsewhere',
        body: 'Your work saves in this browser on this device. At the end, download one PDF and upload it through the course’s normal submission system. No work is sent automatically.'
      }
    ]
  };
});
