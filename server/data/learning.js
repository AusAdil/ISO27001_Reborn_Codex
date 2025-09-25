const learning = {
  'Clause 4.1': {
    what: 'Understand internal and external factors that impact your security goals.',
    why: 'A clear view of context informs risk decisions and stakeholder expectations.',
    how: 'Workshop with leadership, capture drivers, and refresh when strategy changes.'
  },
  'Clause 4.2': {
    what: 'Identify parties (customers, regulators, partners) that rely on your security.',
    why: 'Knowing who cares about your controls helps prioritise obligations.',
    how: 'Maintain a register with contacts, expectations and communication cadence.'
  },
  'Clause 4.3': {
    what: 'Define what parts of the business fall inside the ISMS.',
    why: 'Clear scope boundaries stop audits drifting into areas you are not ready to evidence.',
    how: 'Document the sites, services and teams covered and share the statement widely.'
  },
  'Clause 5.1': {
    what: 'Leaders must visibly back the ISMS and provide direction.',
    why: 'Without sponsorship, resourcing and compliance stall quickly.',
    how: 'Nominate an executive sponsor and integrate ISMS updates into leadership rhythms.'
  },
  'Clause 5.3': {
    what: 'Assign people to manage, operate and improve the ISMS.',
    why: 'Clear accountability prevents gaps and duplication.',
    how: 'Create a RACI showing decision-makers, doers and consulted roles.'
  },
  'Clause 6.1': {
    what: 'Plan how risks are identified, analysed and treated.',
    why: 'Risk management keeps focus on what matters most.',
    how: 'Adopt a simple methodology, hold workshops, maintain a living risk register.'
  },
  'Clause 6.1.3': {
    what: 'Design treatments to reduce risks to acceptable levels.',
    why: 'Treatment plans drive action and demonstrate control.',
    how: 'Define controls, owners, budgets and due dates for each risk response.'
  },
  'Clause 6.2': {
    what: 'Set measurable information security objectives.',
    why: 'Objectives align security with business priorities and enable tracking.',
    how: 'Draft SMART goals, assign owners, and review quarterly.'
  },
  'Clause 6.3': {
    what: 'Plan how security is considered when you change processes, systems or structure.',
    why: 'Unplanned changes can introduce risk and derail compliance commitments.',
    how: 'Embed security impact questions and approvals into project and change templates.'
  },
  'Clause 7.1': {
    what: 'Provide the people, tools and funding your ISMS needs.',
    why: 'Without resources, controls decay and projects stall.',
    how: 'Budget for security roles, training, tooling and managed services.'
  },
  'Clause 7.2': {
    what: 'Ensure people doing security work are competent.',
    why: 'Capability gaps lead to errors and compliance failures.',
    how: 'Assess skills, provide targeted training and track completions.'
  },
  'Clause 7.3': {
    what: 'Keep staff aware of security responsibilities.',
    why: 'Awareness lowers the chance of human-driven incidents.',
    how: 'Run campaigns, phishing simulations and onboarding refreshers.'
  },
  'Clause 7.4': {
    what: 'Coordinate internal and external security communications.',
    why: 'Consistent messaging builds trust and keeps stakeholders informed during change or incidents.',
    how: 'Maintain comms plans that nominate audiences, channels and spokespersons.'
  },
  'Clause 7.5': {
    what: 'Control ISMS documents, records and evidence.',
    why: 'Version control avoids outdated guidance and audit failure.',
    how: 'Centralise documents, enforce reviews, and restrict editing rights.'
  },
  'Clause 8.1': {
    what: 'Plan and control how operations deliver secure services.',
    why: 'Consistent execution reduces surprises and outages.',
    how: 'Use runbooks, monitoring and continual improvement loops.'
  },
  'Clause 8.2': {
    what: 'Carry out risk assessments whenever context or scope changes.',
    why: 'Fresh assessments keep the risk picture accurate and defensible.',
    how: 'Schedule reviews and trigger reassessment after incidents or significant projects.'
  },
  'Clause 8.3': {
    what: 'Treat identified risks and make sure actions land.',
    why: 'Untracked treatments leave unacceptable exposure hanging around.',
    how: 'Assign owners, track progress and verify residual risk is acceptable.'
  },
  'Clause 9.1': {
    what: 'Measure how well security performs.',
    why: 'Metrics highlight emerging issues and success stories.',
    how: 'Define KPIs, collect data and review trends with leadership.'
  },
  'Clause 9.2': {
    what: 'Run internal audits to check control effectiveness.',
    why: 'Audits uncover gaps before certification.',
    how: 'Plan annual audits, train auditors and track findings.'
  },
  'Clause 9.3': {
    what: 'Hold management reviews to steer the ISMS.',
    why: 'Regular reviews align security with business direction.',
    how: 'Review performance, risks, incidents and improvements each quarter.'
  },
  'Clause 10.1': {
    what: 'Continually improve the ISMS.',
    why: 'New threats and business changes demand ongoing updates.',
    how: 'Log ideas, prioritise, assign owners and measure benefits.'
  },
  'Annex A.5': {
    what: 'Define and maintain security policies.',
    why: 'Policies set expectations and support compliance.',
    how: 'Approve policies, communicate them and review annually.'
  },
  'Annex A.6': {
    what: 'Design organisational structures for security.',
    why: 'Clear forums and segregation reduce insider risk.',
    how: 'Form governance bodies and segregate duties in systems.'
  },
  'Annex A.7': {
    what: 'Manage the human lifecycle securely.',
    why: 'Hiring and departures introduce risk if unmanaged.',
    how: 'Screen candidates, onboard securely and manage exits with checklists.'
  },
  'Annex A.8': {
    what: 'Control information assets end-to-end.',
    why: 'Asset visibility underpins classification, protection and disposal.',
    how: 'Maintain an asset register, assign owners and classify information.'
  },
  'Annex A.9': {
    what: 'Manage user access responsibly.',
    why: 'Poor access control is a leading cause of breaches.',
    how: 'Adopt least privilege, automate provisioning and enforce MFA.'
  },
  'Annex A.10': {
    what: 'Apply cryptography appropriately.',
    why: 'Strong cryptography protects confidentiality and integrity.',
    how: 'Set standards, manage keys and integrate checks into delivery pipelines.'
  },
  'Annex A.11': {
    what: 'Protect physical environments supporting information processing.',
    why: 'Physical compromise can bypass logical controls.',
    how: 'Secure perimeters, monitor access and manage disposals.'
  },
  'Annex A.12': {
    what: 'Operate technology securely day to day.',
    why: 'Operational lapses lead to outages and incidents.',
    how: 'Control changes, manage malware, maintain backups and monitor logs.'
  },
  'Annex A.13': {
    what: 'Secure networks and communications.',
    why: 'Segmentation and monitoring prevent spread of attacks.',
    how: 'Architect zones, protect cloud responsibilities and monitor traffic.'
  },
  'Annex A.14': {
    what: 'Bake security into development and acquisition.',
    why: 'Secure-by-design reduces rework and vulnerabilities.',
    how: 'Apply secure coding, testing and supplier assurance in delivery.',
  },
  'Annex A.15': {
    what: 'Manage supplier security risk.',
    why: 'Third parties can introduce significant vulnerabilities.',
    how: 'Assess suppliers, embed clauses and monitor performance.'
  },
  'Annex A.16': {
    what: 'Prepare for and respond to incidents.',
    why: 'Swift response limits business impact and obligations.',
    how: 'Document plans, train teams and run exercises.'
  },
  'Annex A.17': {
    what: 'Ensure continuity of operations.',
    why: 'Disruptions can harm customers and reputation.',
    how: 'Develop, test and improve business continuity arrangements.'
  },
  'Annex A.18': {
    what: 'Meet legal, regulatory and contractual duties.',
    why: 'Non-compliance leads to fines and loss of trust.',
    how: 'Track obligations, update controls and evidence compliance.'
  }
};

module.exports = learning;
