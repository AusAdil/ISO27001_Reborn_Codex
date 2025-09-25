const questions = [
  {
    id: 'CL4-1',
    clause: 'Clause 4.1',
    control: 'Understanding the organisation and its context',
    theme: 'Leadership',
    text: 'Have you clearly defined internal and external issues that affect your information security objectives?',
    answerType: 'yes_no_partial',
    options: [
      { value: 'yes', label: 'Yes, documented and reviewed annually' },
      { value: 'partial', label: 'Partially, informally understood' },
      { value: 'no', label: 'No, not yet assessed' }
    ],
    weight: { criticality: 1.0, impact: 4, defaultScope: 1.0 },
    effort: { tech: 2, people: 4, time: { min: 3, max: 5 } },
    themeBand: 'Leadership',
    actionGuidance: 'Facilitate a context workshop and capture the outputs in a living document.',
    dependencies: []
  },
  {
    id: 'CL4-2',
    clause: 'Clause 4.2',
    control: 'Understanding needs and expectations of interested parties',
    theme: 'Leadership',
    text: 'Do you maintain a register of interested parties and their security expectations?',
    answerType: 'yes_no_partial',
    options: [
      { value: 'yes', label: 'Yes, register maintained and used' },
      { value: 'partial', label: 'Partially, informal stakeholder mapping' },
      { value: 'no', label: 'No, not established' }
    ],
    weight: { criticality: 1.0, impact: 3, defaultScope: 1.0 },
    effort: { tech: 2, people: 3, time: { min: 2, max: 4 } },
    actionGuidance: 'Create and maintain a simple stakeholder matrix with expectations and contact cadence.',
    dependencies: []
  },
  {
    id: 'CL5-1',
    clause: 'Clause 5.1',
    control: 'Leadership and commitment',
    theme: 'Leadership',
    text: 'Does top management actively sponsor the information security management system?',
    answerType: 'yes_no_partial',
    options: [
      { value: 'yes', label: 'Yes, visible and frequent sponsorship' },
      { value: 'partial', label: 'Partially, ad hoc support' },
      { value: 'no', label: 'No, leadership not engaged' }
    ],
    weight: { criticality: 1.5, impact: 5, defaultScope: 1.0 },
    effort: { tech: 1, people: 5, time: { min: 2, max: 4 } },
    actionGuidance: 'Establish an information security steering group chaired by an executive sponsor.',
    dependencies: []
  },
  {
    id: 'CL5-2',
    clause: 'Clause 5.3',
    control: 'Organisational roles, responsibilities and authorities',
    theme: 'Organisation',
    text: 'Are information security roles and responsibilities documented and communicated?',
    answerType: 'yes_no_partial',
    options: [
      { value: 'yes', label: 'Yes, role descriptions communicated' },
      { value: 'partial', label: 'Partially, roles implied but not documented' },
      { value: 'no', label: 'No, roles undefined' }
    ],
    weight: { criticality: 1.5, impact: 4, defaultScope: 1.0 },
    effort: { tech: 2, people: 4, time: { min: 2, max: 4 } },
    actionGuidance: 'Publish RACI matrix covering ISMS responsibilities and communicate to staff.',
    dependencies: []
  },
  {
    id: 'CL6-1',
    clause: 'Clause 6.1',
    control: 'Risk management planning',
    theme: 'Organisation',
    text: 'Do you have a regular and consistent process for identifying and assessing risks?',
    answerType: 'yes_no_partial',
    options: [
      { value: 'yes', label: 'Yes, with scheduled reviews' },
      { value: 'partial', label: 'Partially, reactive or undocumented' },
      { value: 'no', label: 'No formal risk assessment process' }
    ],
    weight: { criticality: 1.5, impact: 5, defaultScope: 1.0 },
    effort: { tech: 3, people: 5, time: { min: 3, max: 6 } },
    actionGuidance: 'Implement a quarterly risk workshop and maintain a centralised register.',
    dependencies: []
  },
  {
    id: 'CL6-2',
    clause: 'Clause 6.1.3',
    control: 'Risk treatment plans',
    theme: 'Organisation',
    text: 'Do you create treatment plans for risks you identify?',
    answerType: 'yes_no_partial',
    options: [
      { value: 'yes', label: 'Yes, treatment plans with owners' },
      { value: 'partial', label: 'Partially, plans drafted but inconsistent' },
      { value: 'no', label: 'No, plans rarely produced' }
    ],
    weight: { criticality: 1.5, impact: 5, defaultScope: 1.0 },
    effort: { tech: 2, people: 5, time: { min: 2, max: 4 } },
    actionGuidance: 'Template treatment plans and assign delivery owners with target dates.',
    dependencies: ['CL6-1']
  },
  {
    id: 'CL6-3',
    clause: 'Clause 6.2',
    control: 'Information security objectives',
    theme: 'Leadership',
    text: 'Are information security objectives measurable and tracked?',
    answerType: 'yes_no_partial',
    options: [
      { value: 'yes', label: 'Yes, tracked with KPIs' },
      { value: 'partial', label: 'Partially, objectives drafted but no KPIs' },
      { value: 'no', label: 'No formal objectives' }
    ],
    weight: { criticality: 1.0, impact: 4, defaultScope: 1.0 },
    effort: { tech: 2, people: 4, time: { min: 2, max: 4 } },
    actionGuidance: 'Set measurable quarterly security objectives aligned to business goals.',
    dependencies: []
  },
  {
    id: 'CL7-1',
    clause: 'Clause 7.1',
    control: 'Resources',
    theme: 'Organisation',
    text: 'Do you have sufficient resources (people, tools, budgets) formally allocated to security?',
    answerType: 'yes_no_partial',
    options: [
      { value: 'yes', label: 'Yes, budgeted and planned' },
      { value: 'partial', label: 'Yes, but reactive and ad hoc' },
      { value: 'no', label: 'No, resources not allocated' }
    ],
    weight: { criticality: 1.5, impact: 4, defaultScope: 1.0 },
    effort: { tech: 1, people: 5, time: { min: 2, max: 3 } },
    actionGuidance: 'Develop a resourcing plan outlining headcount, training and tooling spend.',
    dependencies: []
  },
  {
    id: 'CL7-2',
    clause: 'Clause 7.2',
    control: 'Competence',
    theme: 'People',
    text: 'Are team members trained and competent for their security responsibilities?',
    answerType: 'maturity_1_5',
    options: [
      { value: 1, label: '1 = No formal training' },
      { value: 2, label: '2 = Ad hoc awareness' },
      { value: 3, label: '3 = Planned training for key staff' },
      { value: 4, label: '4 = Role-based training with refreshers' },
      { value: 5, label: '5 = Continuous, role-specific uplift' }
    ],
    weight: { criticality: 1.0, impact: 4, defaultScope: 1.0 },
    effort: { tech: 2, people: 4, time: { min: 3, max: 6 } },
    actionGuidance: 'Create a security capability matrix and deliver targeted training paths.',
    dependencies: []
  },
  {
    id: 'CL7-3',
    clause: 'Clause 7.3',
    control: 'Awareness',
    theme: 'People',
    text: 'Do staff receive regular information security awareness updates?',
    answerType: 'yes_no_partial',
    options: [
      { value: 'yes', label: 'Yes, at least twice per year' },
      { value: 'partial', label: 'Partially, occasional updates' },
      { value: 'no', label: 'No structured awareness program' }
    ],
    weight: { criticality: 1.0, impact: 4, defaultScope: 1.0 },
    effort: { tech: 2, people: 4, time: { min: 2, max: 4 } },
    actionGuidance: 'Roll out a quarterly security awareness campaign with tracking.',
    dependencies: []
  },
  {
    id: 'CL7-4',
    clause: 'Clause 7.5',
    control: 'Documented information',
    theme: 'Organisation',
    text: 'Are documents (policies, procedures) up to date and controlled?',
    answerType: 'maturity_1_5',
    options: [
      { value: 1, label: 'No formal documents' },
      { value: 2, label: 'Inconsistent or outdated' },
      { value: 3, label: 'Documented but uncontrolled' },
      { value: 4, label: 'Documented and controlled' },
      { value: 5, label: 'Fully embedded lifecycle' }
    ],
    weight: { criticality: 1.0, impact: 4, defaultScope: 1.0 },
    effort: { tech: 2, people: 3, time: { min: 3, max: 5 } },
    actionGuidance: 'Implement document control with versioning and annual review cadence.',
    dependencies: []
  },
  {
    id: 'CL8-1',
    clause: 'Clause 8.1',
    control: 'Operational planning and control',
    theme: 'Operations',
    text: 'Are day-to-day security processes (onboarding, backups, access reviews) consistently followed?',
    answerType: 'maturity_1_5',
    options: [
      { value: 1, label: '1 = Ad hoc' },
      { value: 2, label: '2 = Inconsistent' },
      { value: 3, label: '3 = Documented' },
      { value: 4, label: '4 = Embedded with KPIs' },
      { value: 5, label: '5 = Optimised and benchmarked' }
    ],
    weight: { criticality: 1.5, impact: 5, defaultScope: 1.0 },
    effort: { tech: 5, people: 4, time: { min: 4, max: 8 } },
    actionGuidance: 'Deploy runbooks and monitor adherence with dashboards and reviews.',
    dependencies: ['CL7-4']
  },
  {
    id: 'CL9-1',
    clause: 'Clause 9.1',
    control: 'Performance evaluation',
    theme: 'Leadership',
    text: 'Do you monitor and measure the effectiveness of security controls?',
    answerType: 'yes_no_partial',
    options: [
      { value: 'yes', label: 'Yes, metrics reported to leadership' },
      { value: 'partial', label: 'Partially, limited metrics tracked' },
      { value: 'no', label: 'No measurement in place' }
    ],
    weight: { criticality: 1.0, impact: 4, defaultScope: 1.0 },
    effort: { tech: 3, people: 3, time: { min: 3, max: 5 } },
    actionGuidance: 'Define KPIs and report monthly to governance forums.',
    dependencies: ['CL6-3']
  },
  {
    id: 'CL9-2',
    clause: 'Clause 9.2',
    control: 'Internal audit',
    theme: 'Compliance',
    text: 'Is an internal ISMS audit schedule established and executed?',
    answerType: 'yes_no_partial',
    options: [
      { value: 'yes', label: 'Yes, planned and completed annually' },
      { value: 'partial', label: 'Partially, informal spot checks' },
      { value: 'no', label: 'No internal audit activity' }
    ],
    weight: { criticality: 1.0, impact: 3, defaultScope: 1.0 },
    effort: { tech: 1, people: 4, time: { min: 2, max: 4 } },
    actionGuidance: 'Develop a risk-based internal audit plan and assign auditors.',
    dependencies: ['CL7-4']
  },
  {
    id: 'CL9-3',
    clause: 'Clause 9.3',
    control: 'Management review',
    theme: 'Leadership',
    text: 'Do you run management reviews covering ISMS performance at planned intervals?',
    answerType: 'yes_no_partial',
    options: [
      { value: 'yes', label: 'Yes, quarterly review with minutes' },
      { value: 'partial', label: 'Partially, ad hoc updates' },
      { value: 'no', label: 'No formal review' }
    ],
    weight: { criticality: 1.0, impact: 3, defaultScope: 1.0 },
    effort: { tech: 1, people: 3, time: { min: 2, max: 3 } },
    actionGuidance: 'Schedule quarterly management reviews and record outcomes.',
    dependencies: ['CL9-1']
  },
  {
    id: 'CL10-1',
    clause: 'Clause 10.1',
    control: 'Continuous improvement',
    theme: 'Leadership',
    text: 'Is there a structured continual improvement log for security enhancements?',
    answerType: 'yes_no_partial',
    options: [
      { value: 'yes', label: 'Yes, logged and prioritised' },
      { value: 'partial', label: 'Partially, informal ideas list' },
      { value: 'no', label: 'No continual improvement process' }
    ],
    weight: { criticality: 1.0, impact: 3, defaultScope: 1.0 },
    effort: { tech: 1, people: 3, time: { min: 2, max: 3 } },
    actionGuidance: 'Maintain a backlog of improvement opportunities with owners and review cadence.',
    dependencies: ['CL9-3']
  },
  {
    id: 'A5-1',
    clause: 'Annex A.5',
    control: 'Policies for information security',
    theme: 'Leadership',
    text: 'Do you have an approved, communicated information security policy?',
    answerType: 'yes_no_partial',
    options: [
      { value: 'yes', label: 'Yes, approved and communicated' },
      { value: 'partial', label: 'Partially, draft awaiting approval' },
      { value: 'no', label: 'No policy in place' }
    ],
    weight: { criticality: 1.5, impact: 5, defaultScope: 1.0 },
    effort: { tech: 2, people: 3, time: { min: 2, max: 4 } },
    actionGuidance: 'Approve and publish the information security policy with executive endorsement.',
    dependencies: ['CL5-1']
  },
  {
    id: 'A5-2',
    clause: 'Annex A.5',
    control: 'Policies for information security',
    theme: 'Leadership',
    text: 'Do you review your information security policies at planned intervals?',
    answerType: 'yes_no_partial',
    options: [
      { value: 'yes', label: 'Yes, reviewed at least annually' },
      { value: 'partial', label: 'Partially, ad hoc updates' },
      { value: 'no', label: 'No review cycle' }
    ],
    weight: { criticality: 1.0, impact: 4, defaultScope: 1.0 },
    effort: { tech: 2, people: 3, time: { min: 2, max: 4 } },
    actionGuidance: 'Establish a review schedule with owners for each policy.',
    dependencies: ['A5-1']
  },
  {
    id: 'A6-1',
    clause: 'Annex A.6',
    control: 'Organisation of information security',
    theme: 'Organisation',
    text: 'Is there a defined forum or committee overseeing information security?',
    answerType: 'yes_no_partial',
    options: [
      { value: 'yes', label: 'Yes, meets at least quarterly' },
      { value: 'partial', label: 'Partially, informal catch-ups' },
      { value: 'no', label: 'No oversight forum' }
    ],
    weight: { criticality: 1.0, impact: 3, defaultScope: 1.0 },
    effort: { tech: 1, people: 3, time: { min: 2, max: 3 } },
    actionGuidance: 'Form a governance forum with clear charter and standing agenda.',
    dependencies: ['CL5-1']
  },
  {
    id: 'A6-2',
    clause: 'Annex A.6',
    control: 'Segregation of duties',
    theme: 'Technology',
    text: 'Are sensitive duties segregated to prevent conflicts of interest?',
    answerType: 'yes_no_partial',
    options: [
      { value: 'yes', label: 'Yes, enforced with technical controls' },
      { value: 'partial', label: 'Partially, manual checks only' },
      { value: 'no', label: 'No segregation implemented' }
    ],
    weight: { criticality: 1.0, impact: 4, defaultScope: 1.0 },
    effort: { tech: 3, people: 3, time: { min: 3, max: 5 } },
    actionGuidance: 'Implement role-based access and peer review processes.',
    dependencies: ['CL7-4']
  },
  {
    id: 'A7-1',
    clause: 'Annex A.7',
    control: 'Screening',
    theme: 'People',
    text: 'Are background checks completed for new starters before access is granted?',
    answerType: 'yes_no_partial',
    options: [
      { value: 'yes', label: 'Yes, documented screening process' },
      { value: 'partial', label: 'Partially, inconsistent by role' },
      { value: 'no', label: 'No background checks' }
    ],
    weight: { criticality: 1.0, impact: 3, defaultScope: 1.0 },
    effort: { tech: 1, people: 3, time: { min: 2, max: 3 } },
    actionGuidance: 'Formalise screening requirements per role and track completion.',
    dependencies: ['CL7-4']
  },
  {
    id: 'A8-1',
    clause: 'Annex A.8',
    control: 'Asset management',
    theme: 'Operations',
    text: 'Do you maintain an up-to-date inventory of information assets?',
    answerType: 'yes_no_partial',
    options: [
      { value: 'yes', label: 'Yes, centralised and current' },
      { value: 'partial', label: 'Partially, incomplete inventory' },
      { value: 'no', label: 'No inventory maintained' }
    ],
    weight: { criticality: 1.0, impact: 4, defaultScope: 1.0 },
    effort: { tech: 3, people: 3, time: { min: 3, max: 5 } },
    actionGuidance: 'Implement asset register covering owners, classification and lifecycle.',
    dependencies: []
  },
  {
    id: 'A8-2',
    clause: 'Annex A.8',
    control: 'Information classification',
    theme: 'Operations',
    text: 'Is information classified and labelled according to policy?',
    answerType: 'yes_no_partial',
    options: [
      { value: 'yes', label: 'Yes, classification applied' },
      { value: 'partial', label: 'Partially, limited to key systems' },
      { value: 'no', label: 'No classification scheme' }
    ],
    weight: { criticality: 1.0, impact: 4, defaultScope: 1.0 },
    effort: { tech: 2, people: 3, time: { min: 3, max: 5 } },
    actionGuidance: 'Roll out classification standard with labelling guidance and tooling.',
    dependencies: ['A8-1']
  },
  {
    id: 'A8-3',
    clause: 'Annex A.8',
    control: 'Acceptable use of assets',
    theme: 'People',
    text: 'Do users acknowledge acceptable use requirements annually?',
    answerType: 'yes_no_partial',
    options: [
      { value: 'yes', label: 'Yes, acknowledgement captured' },
      { value: 'partial', label: 'Partially, new starters only' },
      { value: 'no', label: 'No acknowledgement process' }
    ],
    weight: { criticality: 1.0, impact: 3, defaultScope: 1.0 },
    effort: { tech: 1, people: 3, time: { min: 2, max: 3 } },
    actionGuidance: 'Introduce annual acceptable use attestation with reminders.',
    dependencies: ['A5-1']
  },
  {
    id: 'A9-1',
    clause: 'Annex A.9',
    control: 'Access control policy',
    theme: 'Technology',
    text: 'Do you enforce least privilege access with regular reviews?',
    answerType: 'maturity_1_5',
    options: [
      { value: 1, label: 'No access policy' },
      { value: 2, label: 'Basic policy, rarely reviewed' },
      { value: 3, label: 'Documented policy, manual reviews' },
      { value: 4, label: 'Automated provisioning and quarterly reviews' },
      { value: 5, label: 'Adaptive access with continuous monitoring' }
    ],
    weight: { criticality: 1.5, impact: 5, defaultScope: 1.0 },
    effort: { tech: 4, people: 3, time: { min: 4, max: 8 } },
    actionGuidance: 'Implement RBAC tooling and align with joiner/mover/leaver process.',
    dependencies: ['A8-1']
  },
  {
    id: 'A9-2',
    clause: 'Annex A.9',
    control: 'User access provisioning',
    theme: 'Technology',
    text: 'Is there a consistent process for provisioning and revoking user access?',
    answerType: 'maturity_1_5',
    options: [
      { value: 1, label: 'Ad hoc approvals' },
      { value: 2, label: 'Email-based with occasional review' },
      { value: 3, label: 'Ticketed workflow with approvals' },
      { value: 4, label: 'Automated provisioning with approvals' },
      { value: 5, label: 'Integrated IAM with certification cycles' }
    ],
    weight: { criticality: 1.0, impact: 4, defaultScope: 1.0 },
    effort: { tech: 4, people: 3, time: { min: 4, max: 7 } },
    actionGuidance: 'Implement workflow tooling for access requests with audit trail.',
    dependencies: ['A9-1']
  },
  {
    id: 'A9-3',
    clause: 'Annex A.9',
    control: 'Multi-factor authentication',
    theme: 'Technology',
    text: 'Is multi-factor authentication enforced for critical systems?',
    answerType: 'yes_no_partial',
    options: [
      { value: 'yes', label: 'Yes, enforced across critical systems' },
      { value: 'partial', label: 'Partially, limited coverage' },
      { value: 'no', label: 'No MFA in place' }
    ],
    weight: { criticality: 1.5, impact: 5, defaultScope: 1.0 },
    effort: { tech: 5, people: 2, time: { min: 2, max: 4 } },
    actionGuidance: 'Roll out MFA using central identity provider and cover admin accounts first.',
    dependencies: ['A9-1']
  },
  {
    id: 'A10-1',
    clause: 'Annex A.10',
    control: 'Cryptography',
    theme: 'Technology',
    text: 'Is there a defined cryptography standard covering key lengths and handling?',
    answerType: 'yes_no_partial',
    options: [
      { value: 'yes', label: 'Yes, standard implemented' },
      { value: 'partial', label: 'Partially, guidance exists but not enforced' },
      { value: 'no', label: 'No cryptography standard' }
    ],
    weight: { criticality: 1.0, impact: 4, defaultScope: 1.0 },
    effort: { tech: 3, people: 2, time: { min: 3, max: 5 } },
    actionGuidance: 'Publish cryptography standard and integrate checks into delivery pipelines.',
    dependencies: ['A5-1']
  },
  {
    id: 'A11-1',
    clause: 'Annex A.11',
    control: 'Physical security perimeters',
    theme: 'Operations',
    text: 'Are physical security controls in place for all locations in scope?',
    answerType: 'yes_no_partial',
    options: [
      { value: 'yes', label: 'Yes, controls documented and monitored' },
      { value: 'partial', label: 'Partially, varies by location' },
      { value: 'no', label: 'No consistent physical security measures' }
    ],
    weight: { criticality: 1.0, impact: 3, defaultScope: 1.0 },
    effort: { tech: 3, people: 3, time: { min: 3, max: 6 } },
    actionGuidance: 'Conduct physical security assessment and remediate identified gaps.',
    dependencies: [],
    scopeRules: [
      { field: 'locations', operator: 'lengthGreaterThan', value: 0 }
    ]
  },
  {
    id: 'A12-1',
    clause: 'Annex A.12',
    control: 'Operations security',
    theme: 'Operations',
    text: 'Are changes to production systems formally assessed and approved?',
    answerType: 'maturity_1_5',
    options: [
      { value: 1, label: 'No change control' },
      { value: 2, label: 'Basic approval via email' },
      { value: 3, label: 'Ticketed change process' },
      { value: 4, label: 'CAB reviews with risk assessment' },
      { value: 5, label: 'Automated controls with guardrails' }
    ],
    weight: { criticality: 1.0, impact: 4, defaultScope: 1.0 },
    effort: { tech: 3, people: 3, time: { min: 3, max: 5 } },
    actionGuidance: 'Adopt change management workflow with risk rating and approvals.',
    dependencies: []
  },
  {
    id: 'A12-2',
    clause: 'Annex A.12',
    control: 'Malware protection',
    theme: 'Technology',
    text: 'Is malware protection deployed and monitored across endpoints?',
    answerType: 'yes_no_partial',
    options: [
      { value: 'yes', label: 'Yes, centrally managed' },
      { value: 'partial', label: 'Partially, limited coverage' },
      { value: 'no', label: 'No malware controls' }
    ],
    weight: { criticality: 1.5, impact: 4, defaultScope: 1.0 },
    effort: { tech: 4, people: 2, time: { min: 3, max: 5 } },
    actionGuidance: 'Deploy endpoint protection with alerting and regular reporting.',
    dependencies: []
  },
  {
    id: 'A12-3',
    clause: 'Annex A.12',
    control: 'Backup',
    theme: 'Operations',
    text: 'Are backups performed, tested and protected against compromise?',
    answerType: 'maturity_1_5',
    options: [
      { value: 1, label: 'Backups ad hoc or missing' },
      { value: 2, label: 'Backups run but untested' },
      { value: 3, label: 'Backups scheduled with basic testing' },
      { value: 4, label: 'Backups tested and segregated' },
      { value: 5, label: 'Immutable backups with automated testing' }
    ],
    weight: { criticality: 1.5, impact: 5, defaultScope: 1.0 },
    effort: { tech: 4, people: 3, time: { min: 3, max: 6 } },
    actionGuidance: 'Implement 3-2-1 backup strategy with routine recovery exercises.',
    dependencies: []
  },
  {
    id: 'A13-1',
    clause: 'Annex A.13',
    control: 'Network security',
    theme: 'Technology',
    text: 'Are networks segmented and monitored to protect critical systems?',
    answerType: 'yes_no_partial',
    options: [
      { value: 'yes', label: 'Yes, segmentation with monitoring' },
      { value: 'partial', label: 'Partially, basic segmentation only' },
      { value: 'no', label: 'No segmentation or monitoring' }
    ],
    weight: { criticality: 1.5, impact: 4, defaultScope: 1.0 },
    effort: { tech: 4, people: 3, time: { min: 4, max: 8 } },
    actionGuidance: 'Design segmented network zones with IDS/IPS and monitoring.',
    dependencies: []
  },
  {
    id: 'A14-1',
    clause: 'Annex A.14',
    control: 'Secure system acquisition',
    theme: 'Technology',
    text: 'Do you apply secure development lifecycle controls to new solutions?',
    answerType: 'maturity_1_5',
    options: [
      { value: 1, label: 'No SDL practices' },
      { value: 2, label: 'Occasional security reviews' },
      { value: 3, label: 'Documented SDL with manual gates' },
      { value: 4, label: 'Integrated security testing in pipeline' },
      { value: 5, label: 'Continuous assurance with automated controls' }
    ],
    weight: { criticality: 1.0, impact: 4, defaultScope: 1.0 },
    effort: { tech: 4, people: 4, time: { min: 4, max: 8 } },
    actionGuidance: 'Embed security gates and tooling into delivery lifecycle.',
    dependencies: []
  },
  {
    id: 'A15-1',
    clause: 'Annex A.15',
    control: 'Supplier relationships',
    theme: 'Supplier',
    text: 'Do you assess suppliers for security risks before onboarding?',
    answerType: 'maturity_1_5',
    options: [
      { value: 1, label: 'No supplier assessments' },
      { value: 2, label: 'Basic questionnaire occasionally' },
      { value: 3, label: 'Risk-based supplier due diligence' },
      { value: 4, label: 'Ongoing monitoring of key suppliers' },
      { value: 5, label: 'Continuous assurance with performance metrics' }
    ],
    weight: { criticality: 1.5, impact: 4, defaultScope: 1.0 },
    effort: { tech: 3, people: 4, time: { min: 3, max: 6 } },
    actionGuidance: 'Stand up supplier risk assessments with tiering and contractual controls.',
    dependencies: [],
    scopeRules: [
      { field: 'supplierReliance', operator: 'in', value: ['Medium', 'High'] }
    ]
  },
  {
    id: 'A15-2',
    clause: 'Annex A.15',
    control: 'Supplier agreements',
    theme: 'Supplier',
    text: 'Are supplier contracts updated with security clauses and SLAs?',
    answerType: 'yes_no_partial',
    options: [
      { value: 'yes', label: 'Yes, contractual clauses standard' },
      { value: 'partial', label: 'Partially, only for critical suppliers' },
      { value: 'no', label: 'No consistent security clauses' }
    ],
    weight: { criticality: 1.0, impact: 3, defaultScope: 1.0 },
    effort: { tech: 1, people: 4, time: { min: 2, max: 4 } },
    actionGuidance: 'Update contract templates with security schedules and review existing agreements.',
    dependencies: ['A15-1'],
    scopeRules: [
      { field: 'supplierReliance', operator: 'in', value: ['Medium', 'High'] }
    ]
  },
  {
    id: 'A16-1',
    clause: 'Annex A.16',
    control: 'Incident management responsibilities',
    theme: 'Incident',
    text: 'Do you have an incident response plan with defined roles?',
    answerType: 'yes_no_partial',
    options: [
      { value: 'yes', label: 'Yes, plan tested' },
      { value: 'partial', label: 'Partially, draft plan' },
      { value: 'no', label: 'No incident response plan' }
    ],
    weight: { criticality: 1.5, impact: 5, defaultScope: 1.0 },
    effort: { tech: 3, people: 4, time: { min: 3, max: 6 } },
    actionGuidance: 'Develop incident response plan and run tabletop exercises.',
    dependencies: []
  },
  {
    id: 'A16-2',
    clause: 'Annex A.16',
    control: 'Incident reporting',
    theme: 'Incident',
    text: 'Is there a process for staff to report security incidents promptly?',
    answerType: 'yes_no_partial',
    options: [
      { value: 'yes', label: 'Yes, clear reporting channels' },
      { value: 'partial', label: 'Partially, informal reporting' },
      { value: 'no', label: 'No defined reporting path' }
    ],
    weight: { criticality: 1.0, impact: 4, defaultScope: 1.0 },
    effort: { tech: 2, people: 3, time: { min: 2, max: 3 } },
    actionGuidance: 'Publish incident reporting process and integrate into awareness training.',
    dependencies: ['A16-1']
  },
  {
    id: 'A17-1',
    clause: 'Annex A.17',
    control: 'Business continuity planning',
    theme: 'BC/DR',
    text: 'Are business continuity plans documented, tested and aligned with critical services?',
    answerType: 'maturity_1_5',
    options: [
      { value: 1, label: 'No business continuity plan' },
      { value: 2, label: 'Plans exist but untested' },
      { value: 3, label: 'Plans documented with basic testing' },
      { value: 4, label: 'Plans tested with scenarios' },
      { value: 5, label: 'Integrated resilience program with metrics' }
    ],
    weight: { criticality: 1.5, impact: 5, defaultScope: 1.0 },
    effort: { tech: 3, people: 4, time: { min: 4, max: 8 } },
    actionGuidance: 'Develop BCP aligned to critical services and run scenario-based tests.',
    dependencies: []
  },
  {
    id: 'A18-1',
    clause: 'Annex A.18',
    control: 'Legal and contractual requirements',
    theme: 'Compliance',
    text: 'Do you track applicable legal, regulatory and contractual security requirements?',
    answerType: 'yes_no_partial',
    options: [
      { value: 'yes', label: 'Yes, register maintained and reviewed' },
      { value: 'partial', label: 'Partially, informal tracking' },
      { value: 'no', label: 'No compliance register' }
    ],
    weight: { criticality: 1.0, impact: 4, defaultScope: 1.0 },
    effort: { tech: 2, people: 3, time: { min: 2, max: 4 } },
    actionGuidance: 'Create compliance obligations register and assign monitoring owners.',
    dependencies: []
  },
  {
    id: 'A18-2',
    clause: 'Annex A.18',
    control: 'Privacy and protection of personally identifiable information',
    theme: 'Compliance',
    text: 'Is personal information handled according to documented privacy controls?',
    answerType: 'maturity_1_5',
    options: [
      { value: 1, label: 'No privacy controls' },
      { value: 2, label: 'Basic compliance awareness' },
      { value: 3, label: 'Documented privacy procedures' },
      { value: 4, label: 'Privacy controls embedded in operations' },
      { value: 5, label: 'Advanced privacy program with monitoring' }
    ],
    weight: { criticality: 1.0, impact: 4, defaultScope: 1.0 },
    effort: { tech: 3, people: 4, time: { min: 3, max: 6 } },
    actionGuidance: 'Map personal data flows and implement privacy impact assessments.',
    dependencies: ['A18-1'],
    scopeRules: [
      { field: 'criticalAssets', operator: 'intersects', value: ['Customer data', 'PHI', 'PCI'] }
    ]
  },
  {
    id: 'A5-3',
    clause: 'Annex A.5',
    control: 'Information security policy awareness',
    theme: 'People',
    text: 'Do all staff confirm they understand the information security policy?',
    answerType: 'yes_no_partial',
    options: [
      { value: 'yes', label: 'Yes, tracked and reported' },
      { value: 'partial', label: 'Partially, onboarding only' },
      { value: 'no', label: 'No acknowledgement process' }
    ],
    weight: { criticality: 1.0, impact: 3, defaultScope: 1.0 },
    effort: { tech: 1, people: 3, time: { min: 2, max: 3 } },
    actionGuidance: 'Introduce periodic policy attestations within HR systems.',
    dependencies: ['A5-1']
  },
  {
    id: 'A8-4',
    clause: 'Annex A.8',
    control: 'Return of assets',
    theme: 'Operations',
    text: 'Do you ensure assets are returned and access revoked when people leave?',
    answerType: 'yes_no_partial',
    options: [
      { value: 'yes', label: 'Yes, deprovisioning checklist completed' },
      { value: 'partial', label: 'Partially, inconsistent tracking' },
      { value: 'no', label: 'No formal exit process' }
    ],
    weight: { criticality: 1.0, impact: 4, defaultScope: 1.0 },
    effort: { tech: 2, people: 3, time: { min: 2, max: 4 } },
    actionGuidance: 'Implement leaver checklist and coordinate HR and IT notifications.',
    dependencies: ['A9-2']
  },
  {
    id: 'A13-2',
    clause: 'Annex A.13',
    control: 'Cloud security responsibilities',
    theme: 'Technology',
    text: 'Do you have documented shared responsibility models for each cloud service used?',
    answerType: 'yes_no_partial',
    options: [
      { value: 'yes', label: 'Yes, defined per service' },
      { value: 'partial', label: 'Partially, only for major platforms' },
      { value: 'no', label: 'No shared responsibility documentation' }
    ],
    weight: { criticality: 1.0, impact: 4, defaultScope: 0.0 },
    effort: { tech: 3, people: 3, time: { min: 2, max: 4 } },
    actionGuidance: 'Document responsibilities with cloud providers and integrate into onboarding.',
    dependencies: ['A8-1'],
    scopeRules: [
      { field: 'hostingModel', operator: 'includes', value: 'cloud' }
    ]
  },
  {
    id: 'A11-2',
    clause: 'Annex A.11',
    control: 'Secure disposal of assets',
    theme: 'Operations',
    text: 'Do you securely dispose of or sanitise information assets when retired?',
    answerType: 'yes_no_partial',
    options: [
      { value: 'yes', label: 'Yes, documented disposal procedures' },
      { value: 'partial', label: 'Partially, inconsistent disposal' },
      { value: 'no', label: 'No secure disposal process' }
    ],
    weight: { criticality: 1.0, impact: 3, defaultScope: 1.0 },
    effort: { tech: 2, people: 3, time: { min: 2, max: 4 } },
    actionGuidance: 'Establish asset disposal procedures including certificates of destruction.',
    dependencies: ['A8-1'],
    scopeRules: [
      { field: 'locations', operator: 'lengthGreaterThan', value: 0 }
    ]
  },
  {
    id: 'A12-4',
    clause: 'Annex A.12',
    control: 'Logging and monitoring',
    theme: 'Technology',
    text: 'Are security logs collected, correlated and reviewed for key systems?',
    answerType: 'maturity_1_5',
    options: [
      { value: 1, label: 'Minimal logging, no review' },
      { value: 2, label: 'Basic logging, manual review' },
      { value: 3, label: 'Centralised logging with periodic review' },
      { value: 4, label: 'Automated alerting and investigation' },
      { value: 5, label: 'Advanced analytics with threat hunting' }
    ],
    weight: { criticality: 1.5, impact: 5, defaultScope: 1.0 },
    effort: { tech: 5, people: 4, time: { min: 4, max: 8 } },
    actionGuidance: 'Deploy central logging platform with alerting and defined response procedures.',
    dependencies: ['A16-1']
  }
];

module.exports = questions;
