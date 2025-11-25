<?php

namespace Database\Seeders;

use App\Models\Answers;
use App\Models\EnrolledTest;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Questions;
use App\Models\Session;
use App\Models\SessionsPivotTestCollection;
use App\Models\TestCollection;
use App\Models\TestCollectionPivotQuestion;
use App\Models\TestResult;

class DataSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Studi Kasus Psikologi
        Questions::create([
            'pertanyaan' => 'Seorang mahasiswa bernama Andi mengalami kesulitan berkonsentrasi saat belajar. Dia mudah terdistraksi oleh suara kecil dan sering melamun. Ketika ujian, dia merasa cemas berlebihan dan sering lupa materi yang sudah dipelajari. Sebagai psikolog, strategi apa yang akan Anda rekomendasikan untuk membantu Andi?',
            'key_answer' => 'Strategi yang dapat direkomendasikan: 1) Teknik manajemen waktu seperti Pomodoro Technique, 2) Latihan mindfulness dan meditasi untuk meningkatkan konsentrasi, 3) Menciptakan lingkungan belajar yang kondusif dan bebas distraksi, 4) Teknik relaksasi untuk mengurangi kecemasan ujian, 5) Metode belajar aktif seperti mind mapping dan summarizing.',
            'dimensi' => 'integritas',
            'type' => 'studi_kasus',
            'is_active' => true,
        ]);

        Questions::create([
            'pertanyaan' => 'Maya adalah seorang karyawan yang baru dipromosikan menjadi supervisor. Dia merasa tidak percaya diri dan takut tidak bisa memimpin timnya dengan baik. Maya sering mengalami imposter syndrome dan merasa tidak layak mendapat promosi tersebut. Bagaimana cara mengatasi masalah psikologis yang dialami Maya?',
            'key_answer' => 'Cara mengatasi: 1) Cognitive restructuring untuk mengubah pemikiran negatif menjadi positif, 2) Membangun self-efficacy melalui pencapaian kecil yang bertahap, 3) Mencari mentor atau role model, 4) Mengembangkan keterampilan kepemimpinan melalui pelatihan, 5) Praktik self-compassion dan menerima bahwa belajar adalah proses yang wajar.',
            'dimensi' => 'integritas',
            'type' => 'studi_kasus',
            'is_active' => true,
        ]);

        Questions::create([
            'pertanyaan' => 'Dalam sebuah keluarga, terdapat konflik antara ayah dan anak remaja yang sering berselisih tentang aturan dan kebebasan. Ayah merasa anaknya terlalu memberontak, sedangkan anak merasa ayahnya terlalu mengekang. Konflik ini sudah berlangsung selama 6 bulan dan mulai mempengaruhi anggota keluarga lainnya. Analisis psikologis apa yang dapat Anda berikan?',
            'key_answer' => 'Analisis: 1) Fase perkembangan remaja yang normal mencari identitas dan otonomi, 2) Perbedaan generasi dalam nilai dan ekspektasi, 3) Kurangnya komunikasi efektif dalam keluarga, 4) Diperlukan family therapy dengan pendekatan sistemik, 5) Mediasi untuk mencari middle ground antara aturan dan kebebasan yang seimbang.',
            'dimensi' => 'integritas',
            'type' => 'studi_kasus',
            'is_active' => true,
        ]);

        Questions::create([
            'pertanyaan' => 'Rina mengalami trauma setelah kecelakaan mobil 3 bulan yang lalu. Dia mengalami flashback, nightmare, dan menghindari berkendara. Rina juga menjadi mudah terkejut dan sulit tidur. Gejala-gejala ini mulai mengganggu aktivitas sehari-harinya. Diagnosis dan intervensi apa yang tepat untuk kasus ini?',
            'key_answer' => 'Diagnosis kemungkinan PTSD (Post-Traumatic Stress Disorder). Intervensi: 1) EMDR (Eye Movement Desensitization and Reprocessing), 2) Cognitive Behavioral Therapy untuk trauma, 3) Exposure therapy bertahap, 4) Teknik grounding dan stabilisasi, 5) Konsultasi medis untuk kemungkinan terapi farmakologi sebagai pendukung.',
            'dimensi' => 'integritas',
            'type' => 'studi_kasus',
            'is_active' => true,
        ]);

        // Intray Analisis Psikologi
        Questions::create([
            'pertanyaan' => 'Anda adalah kepala HRD di sebuah perusahaan. Tim Anda melaporkan bahwa tingkat turnover karyawan meningkat 40% dalam 6 bulan terakhir. Exit interview menunjukkan alasan utama: stres kerja berlebihan, kurangnya work-life balance, dan hubungan dengan atasan yang buruk. Prioritaskan 5 tindakan yang akan Anda ambil untuk mengatasi masalah ini.',
            'key_answer' => 'Prioritas tindakan: 1) Analisis beban kerja dan redistribusi tugas yang lebih adil, 2) Program wellness dan stress management untuk karyawan, 3) Pelatihan kepemimpinan untuk supervisor dan manager, 4) Implementasi flexible working hours atau work from home, 5) Survey engagement berkala dan feedback system yang efektif.',
            'dimensi' => 'integritas',
            'type' => 'intray_analisis',
            'is_active' => true,
        ]);

        Questions::create([
            'pertanyaan' => 'Sebagai psikolog sekolah, Anda mendapat laporan dari guru bahwa ada siswa kelas 10 yang menunjukkan perilaku agresif, nilai menurun drastis, dan sering bolos. Orang tua siswa tersebut baru bercerai 2 bulan lalu. Rancang intervention plan yang komprehensif untuk membantu siswa ini.',
            'key_answer' => 'Intervention plan: 1) Individual counseling untuk memproses emosi terkait perceraian orang tua, 2) Koordinasi dengan guru untuk academic support dan monitoring, 3) Family therapy dengan melibatkan kedua orang tua, 4) Peer support group atau buddy system, 5) Behavior modification program untuk mengurangi perilaku agresif.',
            'dimensi' => 'integritas',
            'type' => 'intray_analisis',
            'is_active' => true,
        ]);

        Questions::create([
            'pertanyaan' => 'Di unit perawatan intensif rumah sakit, perawat menunjukkan gejala burnout: kelelahan emosional, depersonalisasi terhadap pasien, dan penurunan sense of personal accomplishment. Manajemen rumah sakit meminta Anda merancang program intervensi untuk mengatasi burnout ini. Susun proposal program yang detail.',
            'key_answer' => 'Proposal program: 1) Stress inoculation training dan mindfulness program, 2) Peer support groups dan buddy system, 3) Workload analysis dan staffing optimization, 4) Regular mental health screening dan early intervention, 5) Employee assistance program dengan akses konseling gratis, 6) Recognition dan reward system untuk meningkatkan motivasi.',
            'dimensi' => 'integritas',
            'type' => 'intray_analisis',
            'is_active' => true,
        ]);

        Questions::create([
            'pertanyaan' => 'Sebuah startup teknologi mengalami masalah komunikasi antar divisi yang menyebabkan project delay dan konflik interpersonal. CEO meminta Anda sebagai organizational psychologist untuk melakukan assessment dan memberikan rekomendasi. Bagaimana strategi assessment dan intervensi yang akan Anda lakukan?',
            'key_answer' => 'Strategi: 1) Organizational climate assessment melalui survey dan FGD, 2) Communication audit untuk mengidentifikasi gap komunikasi, 3) Team building activities yang fokus pada kolaborasi, 4) Implementasi communication tools dan protokol yang jelas, 5) Conflict resolution training untuk key personnel, 6) Regular team evaluation dan feedback loop.',
            'dimensi' => 'integritas',
            'type' => 'intray_analisis',
            'is_active' => true,
        ]);

        // Kuisioner Perilaku Psikologi
        Questions::create([
            'pertanyaan' => 'Ketika menghadapi konflik dengan rekan kerja, saya cenderung: A) Menghindar dan menunggu masalah hilang sendiri, B) Langsung menghadapi dan mendiskusikan masalah, C) Mencari mediator untuk membantu menyelesaikan, D) Mengalah untuk menjaga keharmonisan, E) Bersikap asertif namun tetap menghormati pendapat lawan. Pilih jawaban yang paling sesuai dengan diri Anda dan jelaskan alasannya.',
            'key_answer' => 'Jawaban E menunjukkan conflict resolution style yang paling sehat. Alasan: Asertivitas memungkinkan ekspresi kebutuhan diri sambil tetap menghormati orang lain, menunjukkan emotional intelligence yang baik, dan cenderung menghasilkan win-win solution. Namun, semua jawaban valid tergantung konteks situasi dan budaya organisasi.',
            'dimensi' => 'integritas',
            'type' => 'kuisioner_perilaku',
            'is_active' => true,
        ]);

        Questions::create([
            'pertanyaan' => 'Dalam situasi stres tinggi, respons yang paling sering saya tunjukkan adalah: A) Menjadi sangat fokus dan produktif, B) Merasa overwhelmed dan sulit mengambil keputusan, C) Mencari dukungan dari orang lain, D) Menarik diri sementara untuk menenangkan pikiran, E) Menggunakan humor untuk mengurangi ketegangan. Analisis respons Anda terhadap stres dan implikasinya terhadap kinerja.',
            'key_answer' => 'Setiap respons memiliki aspek adaptif dan maladaptif. A menunjukkan eustress yang positif, B mengindikasikan distress yang perlu dikelola, C menunjukkan social support seeking yang sehat, D adalah coping strategy yang valid jika tidak berlebihan, E menunjukkan emotion-focused coping yang efektif. Penting untuk mengembangkan multiple coping strategies yang fleksibel.',
            'dimensi' => 'integritas',
            'type' => 'kuisioner_perilaku',
            'is_active' => true,
        ]);

        Questions::create([
            'pertanyaan' => 'Ketika memberikan feedback negatif kepada bawahan, pendekatan yang saya gunakan: A) Langsung dan tegas agar jelas, B) Diplomatis dengan menekankan hal positif dulu, C) Memberikan contoh konkret dan solusi, D) Menunggu momentum yang tepat dan suasana yang kondusif, E) Menggunakan metode sandwich (positif-negatif-positif). Evaluasi efektivitas pendekatan Anda dalam memotivasi perubahan perilaku.',
            'key_answer' => 'Kombinasi B, C, dan D umumnya paling efektif. Pendekatan diplomatik dengan contoh konkret dan timing yang tepat menunjukkan emotional intelligence yang tinggi. Feedback konstruktif harus spesifik, actionable, dan disampaikan dengan empati. Metode sandwich (E) efektif namun harus autentik agar tidak terkesan manipulatif.',
            'dimensi' => 'integritas',
            'type' => 'kuisioner_perilaku',
            'is_active' => true,
        ]);

        Questions::create([
            'pertanyaan' => 'Dalam mengambil keputusan penting, faktor yang paling mempengaruhi saya adalah: A) Data dan analisis objektif, B) Intuisi dan gut feeling, C) Konsultasi dengan orang yang dipercaya, D) Pertimbangan dampak terhadap orang lain, E) Pengalaman masa lalu yang serupa. Refleksikan gaya pengambilan keputusan Anda dan dampaknya terhadap kepemimpinan.',
            'key_answer' => 'Gaya pengambilan keputusan yang efektif mengintegrasikan multiple factors. A menunjukkan analytical thinking, B menunjukkan intuitive intelligence, C menunjukkan collaborative approach, D menunjukkan consideration for others, E menunjukkan experiential learning. Leader yang efektif dapat menggunakan berbagai pendekatan sesuai konteks situasi dan urgency keputusan.',
            'dimensi' => 'integritas',
            'type' => 'kuisioner_perilaku',
            'is_active' => true,
        ]);

        // 6 Studi Kasus Tambahan
        Questions::create([
            'pertanyaan' => 'Seorang remaja berusia 16 tahun menunjukkan perilaku self-harm dan sering mengungkapkan perasaan tidak berharga. Dia memiliki riwayat bullying di sekolah dan hubungan yang tegang dengan orang tua. Bagaimana pendekatan assessment dan intervensi yang tepat untuk kasus ini?',
            'key_answer' => 'Pendekatan: 1) Risk assessment untuk suicide ideation dan self-harm behavior, 2) Comprehensive psychological evaluation termasuk depression screening, 3) Family therapy untuk memperbaiki komunikasi dan dukungan keluarga, 4) Koordinasi dengan sekolah untuk anti-bullying intervention, 5) Individual counseling dengan pendekatan CBT untuk self-esteem dan coping skills.',
            'dimensi' => 'integritas',
            'type' => 'studi_kasus',
            'is_active' => true,
        ]);

        Questions::create([
            'pertanyaan' => 'Pak Budi (45 tahun) mengalami perubahan mood yang drastis sejak didiagnosis diabetes. Dia menjadi mudah marah, menarik diri dari keluarga, dan menolak mengikuti treatment plan dari dokter. Istri melaporkan bahwa Pak Budi sering mengatakan "hidup sudah tidak ada gunanya". Bagaimana intervensi psikologis yang dapat diberikan?',
            'key_answer' => 'Intervensi: 1) Psychological assessment untuk depression dan adjustment disorder, 2) Psychoeducation tentang diabetes dan dampak psikologisnya, 3) Cognitive restructuring untuk mengubah negative thinking patterns, 4) Motivational interviewing untuk treatment adherence, 5) Support group dengan sesama penderita diabetes, 6) Family counseling untuk meningkatkan support system.',
            'dimensi' => 'integritas',
            'type' => 'studi_kasus',
            'is_active' => true,
        ]);

        Questions::create([
            'pertanyaan' => 'Seorang eksekutif wanita berusia 35 tahun mengalami panic attacks berulang selama presentasi penting. Gejala mencakup jantung berdebar, berkeringat, dan perasaan akan pingsan. Hal ini mulai mempengaruhi karir dan kepercayaan dirinya. Bagaimana formulasi kasus dan rencana treatment untuk kondisi ini?',
            'key_answer' => 'Formulasi: Panic disorder dengan situational triggers (public speaking). Treatment plan: 1) Psychoeducation tentang panic attacks dan anxiety, 2) Cognitive-behavioral therapy untuk mengidentifikasi dan mengubah catastrophic thoughts, 3) Exposure therapy gradual untuk public speaking, 4) Relaxation techniques dan breathing exercises, 5) Confidence building melalui skill development dan positive visualization.',
            'dimensi' => 'integritas',
            'type' => 'studi_kasus',
            'is_active' => true,
        ]);

        Questions::create([
            'pertanyaan' => 'Seorang veteran perang menunjukkan gejala hypervigilance, insomnia, dan emotional numbing. Dia menggunakan alkohol sebagai coping mechanism dan mengalami kesulitan mempertahankan pekerjaan. Keluarga melaporkan bahwa dia sering "absent-minded" dan mudah terkejut dengan suara keras. Analisis kasus dan rencana intervensi komprehensif.',
            'key_answer' => 'Diagnosis: Complex PTSD dengan comorbid substance abuse. Intervensi: 1) Stabilization phase dengan focus pada safety dan substance abuse treatment, 2) Trauma-focused therapy (EMDR atau CPT), 3) PTSD-specific CBT untuk symptom management, 4) Vocational rehabilitation dan employment support, 5) Family therapy dan psychoeducation, 6) Medication consultation untuk sleep dan anxiety management.',
            'dimensi' => 'integritas',
            'type' => 'studi_kasus',
            'is_active' => true,
        ]);

        Questions::create([
            'pertanyaan' => 'Anak berusia 8 tahun menunjukkan perilaku agresif di sekolah, kesulitan mengikuti instruksi, dan tidak bisa duduk tenang selama pelajaran. Guru melaporkan bahwa anak tersebut sering mengganggu teman dan impulsif dalam bertindak. Orang tua juga mengeluhkan perilaku serupa di rumah. Bagaimana proses assessment dan intervensi yang tepat?',
            'key_answer' => 'Assessment: Comprehensive evaluation untuk ADHD termasuk observation, rating scales dari guru dan orang tua, cognitive testing. Intervensi: 1) Behavioral intervention plan di sekolah dan rumah, 2) Parent training untuk behavior management, 3) Social skills training untuk anak, 4) Collaboration dengan guru untuk classroom accommodations, 5) Possible medication consultation, 6) Regular monitoring dan progress evaluation.',
            'dimensi' => 'integritas',
            'type' => 'studi_kasus',
            'is_active' => true,
        ]);

        Questions::create([
            'pertanyaan' => 'Seorang mahasiswa tingkat akhir mengalami perfectionism yang ekstrem dan prokrastinasi pada skripsi. Dia takut tidak mencapai standar yang diinginkan sehingga menunda-nunda mengerjakan dan akhirnya semakin cemas. Pola ini sudah berlangsung 6 bulan dan mempengaruhi akademik serta hubungan sosialnya. Bagaimana memahami dan mengatasi masalah ini?',
            'key_answer' => 'Analisis: Perfectionism maladaptif yang menyebabkan anxiety dan procrastination cycle. Intervensi: 1) Cognitive restructuring untuk perfectionist beliefs dan all-or-nothing thinking, 2) Behavioral activation dan task breakdown untuk mengatasi procrastination, 3) Acceptance-based therapy untuk tolerance terhadap imperfection, 4) Time management dan goal-setting skills, 5) Stress management techniques, 6) Academic counseling untuk thesis completion strategies.',
            'dimensi' => 'integritas',
            'type' => 'studi_kasus',
            'is_active' => true,
        ]);

        // 6 Intray Analisis Tambahan
        Questions::create([
            'pertanyaan' => 'Anda adalah koordinator mental health di sebuah universitas. Dalam 2 bulan terakhir, terdapat peningkatan 60% konsultasi mahasiswa terkait anxiety dan depression. Banyak mahasiswa melaporkan academic stress, financial pressure, dan social isolation. Kapasitas konselor terbatas dan waiting list semakin panjang. Susun strategic plan untuk mengatasi krisis ini.',
            'key_answer' => 'Strategic plan: 1) Immediate crisis intervention dengan triage system untuk prioritize urgent cases, 2) Peer counseling program dengan training mahasiswa senior, 3) Group therapy sessions untuk common issues (anxiety, stress management), 4) Campus-wide mental health awareness campaign, 5) Online counseling platform dan self-help resources, 6) Collaboration dengan faculty untuk academic stress reduction, 7) Emergency fund assistance program untuk financial issues.',
            'dimensi' => 'integritas',
            'type' => 'intray_analisis',
            'is_active' => true,
        ]);

        Questions::create([
            'pertanyaan' => 'Sebagai chief psychologist di rehabilitation center, Anda menghadapi challenging case: pasien stroke yang mengalami severe depression dan menolak terapi fisik. Keluarga frustrasi dan staff merasa burnout menghadapi resistensi pasien. Progress recovery sangat lambat dan bed occupancy rate tinggi. Develop comprehensive intervention strategy.',
            'key_answer' => 'Intervention strategy: 1) Motivational interviewing untuk patient engagement dan treatment readiness, 2) Integrated care model dengan collaboration antara psychology, physiotherapy, dan medical team, 3) Family psychoeducation dan support group, 4) Staff debriefing sessions dan vicarious trauma management, 5) Modified therapy approach dengan small achievable goals, 6) Peer support dari recovered stroke patients, 7) Depression treatment dengan therapy dan medication consultation.',
            'dimensi' => 'integritas',
            'type' => 'intray_analisis',
            'is_active' => true,
        ]);

        Questions::create([
            'pertanyaan' => 'Di sebuah pabrik manufaktur, terjadi kecelakaan kerja fatal yang menyebabkan trauma pada witnesses dan co-workers. Management meminta Anda merancang crisis intervention program. Ada concerns tentang PTSD, survivor guilt, dan work performance. Union workers juga menuntut safety improvement. Bagaimana approach yang komprehensif?',
            'key_answer' => 'Crisis intervention: 1) Critical Incident Stress Management (CISM) dengan immediate debriefing sessions, 2) Individual psychological first aid untuk witnesses dan high-risk workers, 3) Group support sessions dan peer support network, 4) Return-to-work assessment dan gradual exposure, 5) Long-term monitoring untuk PTSD symptoms, 6) Safety protocol review dan improvement dengan worker involvement, 7) Management training untuk trauma-informed leadership.',
            'dimensi' => 'integritas',
            'type' => 'intray_analisis',
            'is_active' => true,
        ]);

        Questions::create([
            'pertanyaan' => 'Anda mengelola program rehabilitasi untuk remaja dengan substance abuse. Budget dipotong 30%, staff dikurangi, namun demand meningkat 50%. Banyak remaja dengan comorbid mental health issues dan broken family background. Oversight agency menuntut outcome metrics yang lebih baik. Restructure program untuk maintain effectiveness dengan limited resources.',
            'key_answer' => 'Program restructuring: 1) Group-based treatment model untuk maximize staff efficiency, 2) Family-based intervention dengan trained family members sebagai co-therapists, 3) Peer recovery support specialist program, 4) Technology integration dengan apps dan online resources, 5) Community partnership untuk additional support services, 6) Evidence-based brief interventions, 7) Clear outcome metrics dengan regular monitoring dan data collection.',
            'dimensi' => 'integritas',
            'type' => 'intray_analisis',
            'is_active' => true,
        ]);

        Questions::create([
            'pertanyaan' => 'Sebagai school psychologist di daerah konflik, Anda menghadapi children dengan war trauma. Banyak anak menunjukkan aggressive behavior, learning difficulties, dan social withdrawal. Teachers tidak trained untuk trauma-informed education. Resources minimal dan community support terbatas. Develop sustainable intervention program untuk school-based trauma recovery.',
            'key_answer' => 'Sustainable program: 1) Teacher training dalam trauma-informed classroom practices, 2) School-based group therapy dengan art dan play therapy techniques, 3) Peer mentoring program dengan older students, 4) Community resilience building dengan melibatkan local leaders, 5) Simple screening tools untuk early identification, 6) Parent education workshops untuk trauma support di rumah, 7) Self-care program untuk teachers dan staff.',
            'dimensi' => 'integritas',
            'type' => 'intray_analisis',
            'is_active' => true,
        ]);

        Questions::create([
            'pertanyaan' => 'Anda memimpin tim psikologi di elderly care facility yang menghadapi COVID-19 outbreak. Banyak residents mengalami social isolation, cognitive decline accelerated, dan increased depression. Staff juga stressed dan beberapa resign. Family visits terbatas. Mortality rate tinggi menimbulkan grief reactions. Design comprehensive mental health response plan.',
            'key_answer' => 'Response plan: 1) Virtual connection program dengan family melalui technology, 2) In-facility social activities yang aman dengan small groups, 3) Grief counseling dan memorial services untuk deceased residents, 4) Staff support program dengan counseling dan stress management, 5) Cognitive stimulation programs untuk prevent decline, 6) Depression screening dan intervention protocols, 7) Collaboration dengan medical team untuk integrated care approach.',
            'dimensi' => 'integritas',
            'type' => 'intray_analisis',
            'is_active' => true,
        ]);

        // 6 Kuisioner Perilaku Tambahan
        Questions::create([
            'pertanyaan' => 'Ketika tim saya menghadapi deadline yang ketat dan tekanan tinggi, gaya kepemimpinan yang saya terapkan: A) Micromanagement untuk memastikan kualitas, B) Delegasi penuh dengan minimal supervision, C) Supportive leadership dengan frequent check-ins, D) Directive leadership dengan clear instructions, E) Collaborative approach dengan shared decision making. Evaluasi efektivitas gaya kepemimpinan Anda dalam situasi crisis.',
            'key_answer' => 'Situational leadership menunjukkan bahwa efektivitas bergantung pada maturity tim dan complexity task. C dan D umumnya efektif dalam crisis: supportive untuk tim experienced, directive untuk tim baru. Micromanagement (A) dapat menurunkan morale, delegasi penuh (B) berisiko dalam deadline ketat. Leader yang efektif dapat flex antara styles sesuai situasi dan team needs.',
            'dimensi' => 'integritas',
            'type' => 'kuisioner_perilaku',
            'is_active' => true,
        ]);

        Questions::create([
            'pertanyaan' => 'Ketika menghadapi kegagalan besar dalam project yang saya pimpin, reaksi pertama saya adalah: A) Menganalisis what went wrong secara detail, B) Fokus pada damage control dan solution, C) Mengambil full responsibility di hadapan stakeholders, D) Gathering team untuk post-mortem discussion, E) Refleksi personal tentang leadership lessons learned. Analisis emotional intelligence dalam failure management.',
            'key_answer' => 'Failure management yang matang mengintegrasikan semua aspek: immediate damage control (B), accountability (C), systematic analysis (A), team learning (D), dan personal growth (E). Sequence yang efektif: damage control dulu, lalu accountability, kemudian analysis dan learning. Emotional intelligence terlihat dari kemampuan manage own emotions dan team morale during crisis.',
            'dimensi' => 'integritas',
            'type' => 'kuisioner_perilaku',
            'is_active' => true,
        ]);

        Questions::create([
            'pertanyaan' => 'Dalam mengelola konflik antar departemen yang sudah berlangsung lama, pendekatan yang paling saya prioritaskan: A) Mediasi formal dengan pihak ketiga, B) Separate meetings dengan setiap pihak dulu, C) Joint problem-solving session, D) Escalation ke management level atas, E) Focus pada common goals dan shared interests. Refleksikan kemampuan conflict resolution Anda.',
            'key_answer' => 'Conflict resolution yang efektif dimulai dengan understanding root causes melalui separate meetings (B), kemudian identifying common ground (E), baru joint sessions (C). Mediasi formal (A) diperlukan jika direct approach gagal. Escalation (D) sebagai last resort. Skilled conflict resolver dapat de-escalate emotions dan refocus pada collaborative solutions.',
            'dimensi' => 'integritas',
            'type' => 'kuisioner_perilaku',
            'is_active' => true,
        ]);

        Questions::create([
            'pertanyaan' => 'Ketika harus memberikan performance review yang tidak memuaskan kepada karyawan senior, strategi komunikasi saya: A) Direct dan straightforward untuk clarity, B) Gradual approach dengan memulai dari positive aspects, C) Focus pada specific behaviors bukan personality, D) Collaborative discussion tentang improvement plan, E) Empathetic approach dengan emotional support. Evaluasi sensitive communication skills Anda.',
            'key_answer' => 'Effective performance feedback mengkombinasikan B (positive start), C (behavior-focused), D (collaborative planning), dan E (empathy). Hindari pure direct approach (A) yang bisa defensive. Skilled communicator balances honesty dengan compassion, focuses pada development opportunities, dan ensures two-way dialogue untuk sustainable improvement.',
            'dimensi' => 'integritas',
            'type' => 'kuisioner_perilaku',
            'is_active' => true,
        ]);

        Questions::create([
            'pertanyaan' => 'Dalam situation dimana saya harus mengambil unpopular decision untuk kebaikan organisasi, approach saya: A) Transparant explanation tentang reasoning, B) Gradual implementation dengan pilot program, C) Stakeholder consultation sebelum final decision, D) Clear communication tentang expected benefits, E) Support system untuk yang terdampak. Analisis courage dan wisdom dalam decision making.',
            'key_answer' => 'Unpopular but necessary decisions memerlukan combination dari consultation (C), transparent reasoning (A), clear benefit communication (D), dan support untuk affected parties (E). Gradual implementation (B) bisa efektif untuk major changes. Leadership courage terlihat dari willingness take tough decisions, wisdom dari thorough consideration of stakeholder impact.',
            'dimensi' => 'integritas',
            'type' => 'kuisioner_perilaku',
            'is_active' => true,
        ]);

        Questions::create([
            'pertanyaan' => 'Ketika menghadapi ethical dilemma antara company interests dan personal values, decision framework yang saya gunakan: A) Company policy dan legal compliance sebagai prioritas, B) Personal moral compass sebagai guide utama, C) Stakeholder impact analysis, D) Long-term consequences evaluation, E) Consultation dengan trusted advisors. Refleksikan ethical reasoning dan integrity Anda.',
            'key_answer' => 'Ethical decision making memerlukan integration dari legal compliance (A), personal values (B), stakeholder impact (C), long-term thinking (D), dan wise counsel (E). Mature ethical reasoning considers multiple perspectives, seeks win-win solutions, dan maintains integrity. True leadership involves moral courage untuk do the right thing bahkan when difficult.',
            'dimensi' => 'integritas',
            'type' => 'kuisioner_perilaku',
            'is_active' => true,
        ]);

        TestCollection::create([
            'nama' => 'Tes Psikologi Komprehensif',
            'deskripsi' => 'Tes psikologi yang mencakup studi kasus, analisis situasi, dan penilaian perilaku untuk evaluasi komprehensif',
            'kode' => 'PSI',
            'is_active' => true,
        ]);

        // Menghubungkan semua 10 soal studi kasus ke test collection 1
        for ($i = 1; $i <= 10; $i++) {
            TestCollectionPivotQuestion::create([
                'test_collection_id' => 1,
                'question_id' => $i,
                'is_active' => true,
            ]);
        }

        TestCollection::create([
            'nama' => 'Tes Analisis Situasi dan Problem Solving',
            'deskripsi' => 'Evaluasi kemampuan analisis situasi kerja dan problem solving dalam konteks psikologi organisasi',
            'kode' => 'INT',
            'is_active' => true,
        ]);

        // Menghubungkan semua 10 soal intray analisis ke test collection 2
        for ($i = 11; $i <= 20; $i++) {
            TestCollectionPivotQuestion::create([
                'test_collection_id' => 2,
                'question_id' => $i,
                'is_active' => true,
            ]);
        }

        TestCollection::create([
            'nama' => 'Tes Evaluasi Perilaku dan Kepribadian',
            'deskripsi' => 'Kuisioner evaluasi perilaku untuk mengukur gaya kepemimpinan, manajemen konflik, dan pengambilan keputusan',
            'kode' => 'KUI',
            'is_active' => true,
        ]);

        // Menghubungkan semua 10 soal kuisioner perilaku ke test collection 3
        for ($i = 21; $i <= 30; $i++) {
            TestCollectionPivotQuestion::create([
                'test_collection_id' => 3,
                'question_id' => $i,
                'is_active' => true,
            ]);
        }

        Session::create([
            'name' => 'Sesi Evaluasi Psikologi Komprehensif',
            'description' => 'Sesi tes psikologi yang mencakup studi kasus, analisis situasi, dan evaluasi perilaku untuk penilaian menyeluruh',
            'duration_1' => 300, // 5 menit untuk setiap kategori
            'duration_2' => 300,
            'duration_3' => 300,
            'start_date' => '2024-06-01',
            'end_date' => '2026-06-30',
            'code' => '123456',
            'is_active' => true,
        ]);

        SessionsPivotTestCollection::create([
            'session_id' => 1,
            'test_collection_id' => 1,
        ]);

        SessionsPivotTestCollection::create([
            'session_id' => 1,
            'test_collection_id' => 2,
        ]);

        SessionsPivotTestCollection::create([
            'session_id' => 1,
            'test_collection_id' => 3,
        ]);

        EnrolledTest::create([
            'user_id' => 3,
            'session_id' => 1,
        ]);

        // Menggunakan kategori_1 untuk semua seperti yang diminta
        TestResult::create([
            'user_id' => 3,
            'session_id' => 1,
            'category' => 'kategori_1_istirahat',
            'is_predicted' => false,
            
            
        ]);

        TestResult::create([
            'user_id' => 3,
            'session_id' => 1,
            'category' => 'kategori_1',
            'is_predicted' => false,
            
            
        ]);

        // Jawaban untuk kategori_1 (studi kasus) - 10 soal
        for ($i = 1; $i <= 10; $i++) {
            Answers::create([
                'user_id' => 3,
                'question_id' => $i,
                'test_result_id' => 2,
                'jawaban' => 'Contoh jawaban untuk soal studi kasus psikologi nomor ' . $i,
            ]);
        }

        TestResult::create([
            'user_id' => 3,
            'session_id' => 1,
            'category' => 'kategori_1_istirahat',
            'is_predicted' => false,
            
            
        ]);

        TestResult::create([
            'user_id' => 3,
            'session_id' => 1,
            'category' => 'kategori_1',
            'is_predicted' => false,
            
            
        ]);

        // Jawaban untuk kategori_1 (intray analisis) - 10 soal
        for ($i = 11; $i <= 20; $i++) {
            Answers::create([
                'user_id' => 3,
                'question_id' => $i,
                'test_result_id' => 4,
                'jawaban' => 'Contoh jawaban untuk soal analisis situasi nomor ' . ($i - 10),
            ]);
        }

        TestResult::create([
            'user_id' => 3,
            'session_id' => 1,
            'category' => 'kategori_1_istirahat',
            'is_predicted' => false,
            
            
        ]);

        TestResult::create([
            'user_id' => 3,
            'session_id' => 1,
            'category' => 'kategori_1',
            'is_predicted' => false,
            
            
        ]);

        // Jawaban untuk kategori_1 (kuisioner perilaku) - 10 soal
        for ($i = 21; $i <= 30; $i++) {
            Answers::create([
                'user_id' => 3,
                'question_id' => $i,
                'test_result_id' => 6,
                'jawaban' => 'Contoh jawaban untuk kuisioner perilaku nomor ' . ($i - 20),
            ]);
        }

        // ===== PAKET SOAL TAMBAHAN =====
        // PENTING: Setiap paket harus berisi soal dengan TYPE yang sama
        // karena controller mengambil soal berdasarkan type (studi_kasus, intray_analisis, kuisioner_perilaku)

        // Paket 4: Studi Kasus Set 1 (soal 1, 2, 3, 4 - semua type studi_kasus)
        TestCollection::create([
            'nama' => 'Paket Studi Kasus Set 1',
            'deskripsi' => 'Studi kasus psikologi klinis dan konseling',
            'kode' => 'SK-001',
            'is_active' => true,
        ]);

        // Mapping soal ke paket 4 - hanya soal studi_kasus
        $paket4_soal = [1, 2, 3, 4];
        foreach ($paket4_soal as $soal_id) {
            TestCollectionPivotQuestion::create([
                'test_collection_id' => 4,
                'question_id' => $soal_id,
                'is_active' => true,
            ]);
        }

        // Paket 5: Intray Analisis Set 1 (soal 5, 6, 7, 8 - semua type intray_analisis)
        TestCollection::create([
            'nama' => 'Paket Intray Analisis Set 1',
            'deskripsi' => 'Analisis situasi organisasi dan problem solving',
            'kode' => 'IA-001',
            'is_active' => true,
        ]);

        // Mapping soal ke paket 5 - hanya soal intray_analisis
        $paket5_soal = [5, 6, 7, 8];
        foreach ($paket5_soal as $soal_id) {
            TestCollectionPivotQuestion::create([
                'test_collection_id' => 5,
                'question_id' => $soal_id,
                'is_active' => true,
            ]);
        }

        // Paket 6: Kuisioner Perilaku Set 1 (soal 9, 10, 11, 12 - semua type kuisioner_perilaku)
        TestCollection::create([
            'nama' => 'Paket Kuisioner Perilaku Set 1',
            'deskripsi' => 'Evaluasi perilaku dan gaya kepemimpinan',
            'kode' => 'KB-001',
            'is_active' => true,
        ]);

        // Mapping soal ke paket 6 - hanya soal kuisioner_perilaku
        $paket6_soal = [9, 10, 11, 12];
        foreach ($paket6_soal as $soal_id) {
            TestCollectionPivotQuestion::create([
                'test_collection_id' => 6,
                'question_id' => $soal_id,
                'is_active' => true,
            ]);
        }

        // Paket 7: Kuisioner Perilaku Set 2 (soal 25, 26, 27, 28 - semua type kuisioner_perilaku)
        TestCollection::create([
            'nama' => 'Paket Kuisioner Perilaku Set 2',
            'deskripsi' => 'Evaluasi pengambilan keputusan dan etika',
            'kode' => 'KB-002',
            'is_active' => true,
        ]);

        // Mapping soal ke paket 7 - hanya soal kuisioner_perilaku
        $paket7_soal = [25, 26, 27, 28];
        foreach ($paket7_soal as $soal_id) {
            TestCollectionPivotQuestion::create([
                'test_collection_id' => 7,
                'question_id' => $soal_id,
                'is_active' => true,
            ]);
        }

        // ===== SESI TAMBAHAN =====

        // Sesi 2: Tes Lengkap dengan Paket 4 (studi_kasus) + 5 (intray) + 6 (kuisioner)
        Session::create([
            'name' => 'Sesi Tes Psikologi Lengkap',
            'description' => 'Kombinasi studi kasus, intray analisis, dan kuisioner perilaku',
            'duration_1' => 240, // 4 menit untuk studi_kasus (4 soal)
            'duration_2' => 240, // 4 menit untuk intray_analisis (4 soal)
            'duration_3' => 240, // 4 menit untuk kuisioner_perilaku (4 soal)
            'start_date' => '2024-06-01',
            'end_date' => '2026-06-30',
            'code' => '789012',
            'is_active' => true,
        ]);

        SessionsPivotTestCollection::create([
            'session_id' => 2,
            'test_collection_id' => 4, // Paket Studi Kasus Set 1
        ]);

        SessionsPivotTestCollection::create([
            'session_id' => 2,
            'test_collection_id' => 5, // Paket Intray Analisis Set 1
        ]);

        SessionsPivotTestCollection::create([
            'session_id' => 2,
            'test_collection_id' => 6, // Paket Kuisioner Perilaku Set 1
        ]);

        // Sesi 3: Tes Kuisioner Ganda
        Session::create([
            'name' => 'Sesi Kuisioner Perilaku Komprehensif',
            'description' => 'Evaluasi perilaku dengan dua set kuisioner',
            'duration_1' => 120,
            'duration_2' => 120,
            'duration_3' => 240, // 4 menit untuk kuisioner set 1 + 2 (8 soal)
            'start_date' => '2024-06-01',
            'end_date' => '2026-06-30',
            'code' => '345678',
            'is_active' => true,
        ]);

        SessionsPivotTestCollection::create([
            'session_id' => 3,
            'test_collection_id' => 6, // Paket Kuisioner Perilaku Set 1
        ]);

        SessionsPivotTestCollection::create([
            'session_id' => 3,
            'test_collection_id' => 7, // Paket Kuisioner Perilaku Set 2
        ]);

        // Sesi 4: Tes Assessment Menyeluruh (sama dengan sesi 2)
        Session::create([
            'name' => 'Sesi Assessment Menyeluruh',
            'description' => 'Kombinasi studi kasus, intray, dan kuisioner',
            'duration_1' => 240,
            'duration_2' => 240,
            'duration_3' => 240,
            'start_date' => '2024-06-01',
            'end_date' => '2026-06-30',
            'code' => '901234',
            'is_active' => true,
        ]);

        SessionsPivotTestCollection::create([
            'session_id' => 4,
            'test_collection_id' => 4, // Paket Studi Kasus Set 1
        ]);

        SessionsPivotTestCollection::create([
            'session_id' => 4,
            'test_collection_id' => 5, // Paket Intray Analisis Set 1
        ]);

        SessionsPivotTestCollection::create([
            'session_id' => 4,
            'test_collection_id' => 6, // Paket Kuisioner Perilaku Set 1
        ]);

        // ===== ENROLLMENT DATA =====

        // User 4 - sudah mengerjakan tes di sesi 2
        EnrolledTest::create([
            'user_id' => 4,
            'session_id' => 2,
        ]);

        TestResult::create([
            'user_id' => 4,
            'session_id' => 2,
            'category' => 'kategori_1',
            'is_predicted' => false,
            
            
        ]);

        for ($i = 1; $i <= 10; $i++) {
            Answers::create([
                'user_id' => 4,
                'question_id' => $i,
                'test_result_id' => 7,
                'jawaban' => 'Jawaban user 4 untuk soal nomor ' . $i,
            ]);
        }

        // User 5 - enrolled di sesi 2 TAPI BELUM MENGERJAKAN TES
        EnrolledTest::create([
            'user_id' => 5,
            'session_id' => 2,
        ]);
        // TIDAK ADA TestResult dan Answers untuk user 5

        // Enrollment untuk sesi lainnya
        EnrolledTest::create([
            'user_id' => 4,
            'session_id' => 3,
        ]);

        EnrolledTest::create([
            'user_id' => 3,
            'session_id' => 4,
        ]);

        // ===== ASSIGN PSIKOLOG KE SEMUA SESSION =====
        $psikolog = User::where('email', 'psikolog@gmail.com')->first();
        if ($psikolog) {
            $psikolog->assignedSessions()->attach([1, 2, 3, 4]);
        }
    }
}
