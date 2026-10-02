   const categoryMap = {
    // Pola Deret: Index 0, 7, dan 10 s.d 34
    pattern: [0, 7, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34],
    
    // Matematika: Index 1, 6, 9, dan 35 s.d 59
    math: [1, 6, 9, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59],
    
    // Logika Penalaran: Index 3, 4, 5, 8, dan 60 s.d 84
    logic: [3, 4, 5, 8, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84],
    
    // Pengetahuan Umum: Index 2, dan 85 s.d 99
    general: [2, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99]
};

    let currentQuestionIndex = 0;
    let score = 0;
    let selectedOptionIndex = null;
    let userAnswers = []; // Menyimpan jawaban user untuk statistik berdasarkan index asli
    let questionOrder = []; // Menyimpan urutan acak soal

    function startTest() {
        currentQuestionIndex = 0;
        score = 0;
        userAnswers = [];

        // Mengacak urutan soal (Fisher-Yates Shuffle)
   questionOrder = Array.from({length: questions.length}, (_, i) => i);
        for (let i = questionOrder.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [questionOrder[i], questionOrder[j]] = [questionOrder[j], questionOrder[i]];
}
       // Tambahkan 1 baris ini agar aplikasi hanya mengambil 10 soal saja dari 100 yang tersedia
       questionOrder = questionOrder.slice(0, 10);
       
       
        
        document.getElementById('start-screen').classList.remove('active');
        document.getElementById('result-screen').classList.remove('active');
        document.getElementById('quiz-screen').classList.add('active');
        loadQuestion();
    }

    function resetTest() {
        startTest();
    }

        function loadQuestion() {
        selectedOptionIndex = null;
        document.getElementById('next-btn').disabled = true;
        
        // PERBAIKAN: questions.length diganti jadi questionOrder.length
        document.getElementById('next-btn').innerText = (currentQuestionIndex === questionOrder.length - 1) ? "Selesai & Hitung IQ" : "Selanjutnya";

        const originalIndex = questionOrder[currentQuestionIndex];
        const q = questions[originalIndex];
        
        // PERBAIKAN: questions.length diganti jadi questionOrder.length
        const progress = (currentQuestionIndex / questionOrder.length) * 100;
        document.getElementById('progress-bar').style.width = progress + '%';
        document.getElementById('question-number').innerText = `Pertanyaan ${currentQuestionIndex + 1} dari ${questionOrder.length}`;
        document.getElementById('question-text').innerText = q.question;
        
        const optionsContainer = document.getElementById('options-container');
        optionsContainer.innerHTML = '';
        
        q.options.forEach((opt, index) => {
            const btn = document.createElement('button');
            btn.className = 'option-btn';
            btn.innerText = opt;
            btn.onclick = () => selectOption(index, btn);
            optionsContainer.appendChild(btn);
        });
        }


    function selectOption(index, btn) {
        selectedOptionIndex = index;
        const buttons = document.querySelectorAll('.option-btn');
        buttons.forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        document.getElementById('next-btn').disabled = false;
    }

    function nextQuestion() {
        const originalIndex = questionOrder[currentQuestionIndex];
        const isCorrect = (selectedOptionIndex === questions[originalIndex].answer);
        
        userAnswers[originalIndex] = isCorrect;
        
        if (isCorrect) score++;

        currentQuestionIndex++;

        // PERBAIKAN: questions.length diganti jadi questionOrder.length
        if (currentQuestionIndex < questionOrder.length) {
            loadQuestion();
        } else {
            showResult();
        }
      }


    function showResult(sharedData = null) {
        document.getElementById('start-screen').classList.remove('active');
        document.getElementById('quiz-screen').classList.remove('active');
        document.getElementById('result-screen').classList.add('active');
        
        let calculatedIQ, category, desc, isShared = false;

        if (sharedData) {
            // Mode Melihat Link Orang Lain
            calculatedIQ = sharedData.iq;
            category = sharedData.cat;
            desc = sharedData.desc;
            isShared = true;

            document.getElementById('result-title').innerText = "Hasil StarIQ Milik Seseorang";
            document.getElementById('result-subtitle').innerText = "Berikut adalah skor IQ yang telah dibagikan kepada Anda:";
            document.getElementById('btn-restart').innerText = "Ikuti Tes Ini Sendiri";
            document.getElementById('btn-share').style.display = 'none';
            document.getElementById('share-box').style.display = 'none';
        } else {
            // Mode Selesai Tes Sendiri
            calculatedIQ = 75 + (score * 6);
            
            if (calculatedIQ >= 130) {
                category = "Sangat Superior (Genius)";
                desc = "Luar biasa! Analisis logika dan matematika Anda berada di tingkat sangat jenius.";
            } else if (calculatedIQ >= 120) {
                category = "Superior";
                desc = "Hebat! Anda memiliki kecerdasan dan memecahkan masalah di atas rata-rata yang sangat baik.";
            } else if (calculatedIQ >= 110) {
                category = "Rata-rata Atas";
                desc = "Bagus! Kemampuan kognitif dan logika Anda berada di atas kebanyakan orang.";
            } else if (calculatedIQ >= 90) {
                category = "Rata-rata";
                desc = "Anda memiliki kemampuan kognitif dan logika yang normal/standar.";
            } else {
                category = "Rata-rata Bawah";
                desc = "Pertanyaan ini mungkin cukup menantang. Terus latih kemampuan logika Anda!";
            }

            document.getElementById('result-title').innerText = "Hasil Tes IQ Anda";
            document.getElementById('result-subtitle').innerText = "Berdasarkan perhitungan logika dan ketepatan jawaban Anda:";
            document.getElementById('btn-restart').innerText = "Ulangi Tes";
            document.getElementById('btn-share').style.display = 'inline-block';
            document.getElementById('share-box').style.display = 'none';
            
            // SAVE TO HISTORY & STATS
            saveToHistory(calculatedIQ, category, desc);
        }

        document.getElementById('iq-score').innerText = calculatedIQ;
        document.getElementById('iq-category').innerText = category;
        document.getElementById('iq-description').innerText = desc;
    }

    // --- SIDEBAR & PAGE LOGIC ---
    function toggleSidebar() {
        const sidebar = document.getElementById('sidebar');
        const overlay = document.getElementById('overlay');
        sidebar.classList.toggle('open');
        overlay.classList.toggle('show');
    }

    function switchPage(page) {
        // Toggle Nav Classes
        document.getElementById('nav-dashboard').classList.remove('active-menu');
        document.getElementById('nav-history').classList.remove('active-menu');
        document.getElementById('nav-' + page).classList.add('active-menu');

        // Toggle Pages
        document.getElementById('page-dashboard').classList.remove('active-page');
        document.getElementById('page-history').classList.remove('active-page');
        document.getElementById('page-' + page).classList.add('active-page');

        // Close sidebar
        toggleSidebar();

        // If history, render it
        if(page === 'history') {
            renderHistory();
        }
    }

    // --- HISTORY CALCULATION ---
    function saveToHistory(iq, cat, desc) {
        const stats = {
            pattern: calcPercent(categoryMap.pattern),
            math: calcPercent(categoryMap.math),
            logic: calcPercent(categoryMap.logic)
        };

        const historyData = {
            date: new Date().toLocaleDateString('id-ID', {day: 'numeric', month: 'long', year: 'numeric'}),
            iq: iq,
            category: cat,
            desc: desc,
            stats: stats
        };

        localStorage.setItem('stariq_history', JSON.stringify(historyData));
    }

    function calcPercent(indexes) {
        let correctCount = 0;
        let testedCount = 0; // Tambahan variabel untuk menghitung soal yang benar-benar keluar
        
        indexes.forEach(idx => {
            if (userAnswers[idx] !== undefined) {
                testedCount++;
                if (userAnswers[idx]) correctCount++;
            }
        });
        
        if (testedCount === 0) return 0; // Mencegah error jika tipe soal ini tidak keluar sama sekali
        return Math.round((correctCount / testedCount) * 100);
    }


    function renderHistory() {
        const historyContainer = document.getElementById('history-content');
        const dataString = localStorage.getItem('stariq_history');

        if (!dataString) {
            historyContainer.innerHTML = '<div class="empty-history">Belum ada riwayat tes. Silakan selesaikan tes di Dashboard.</div>';
            return;
        }

        const data = JSON.parse(dataString);

        historyContainer.innerHTML = `
            <div style="background: #eff6ff; border: 1px solid var(--primary-color); border-radius: 8px; padding: 20px; margin-bottom: 25px; text-align:center;">
                <h3 style="margin-bottom: 5px;">Skor Terakhir (${data.date})</h3>
                <div style="font-size: 40px; font-weight: 700; color: var(--primary-color);">${data.iq}</div>
                <div style="font-weight: 600; color: var(--text-main);">${data.category}</div>
            </div>

            <h3 style="margin-bottom: 20px; font-size:18px;">Statistik Kemampuan</h3>
            
            <div class="stat-row">
                <div class="stat-label"><span>Penalaran Logika</span> <span>${data.stats.logic}%</span></div>
                <div class="stat-bar-bg"><div class="stat-bar-fill" style="width: ${data.stats.logic}%; background: #3b82f6;"></div></div>
            </div>

            <div class="stat-row">
                <div class="stat-label"><span>Analisis Matematika</span> <span>${data.stats.math}%</span></div>
                <div class="stat-bar-bg"><div class="stat-bar-fill" style="width: ${data.stats.math}%; background: #10b981;"></div></div>
            </div>

            <div class="stat-row">
                <div class="stat-label"><span>Pengenalan Pola & Deret</span> <span>${data.stats.pattern}%</span></div>
                <div class="stat-bar-bg"><div class="stat-bar-fill" style="width: ${data.stats.pattern}%; background: #f59e0b;"></div></div>
            </div>
        `;
    }

    // --- SHARE LINK (BASE64) ---
    function generateShareLink() {
        const iq = document.getElementById('iq-score').innerText;
        const cat = document.getElementById('iq-category').innerText;
        const desc = document.getElementById('iq-description').innerText;

        const payload = {
            iq: parseInt(iq),
            cat: cat,
            desc: desc
        };

        const base64Str = btoa(encodeURIComponent(JSON.stringify(payload)));
        
        const baseUrl = window.location.origin + window.location.pathname;
        const shareUrl = `${baseUrl}?result=${base64Str}`;

        const shareBox = document.getElementById('share-box');
        const shareInput = document.getElementById('share-link-input');
        
        shareBox.style.display = 'block';
        shareInput.value = shareUrl;
        shareInput.select();
    }

    // --- INIT APP ---
    window.onload = function() {
        const urlParams = new URLSearchParams(window.location.search);
        const resultParam = urlParams.get('result');

        if (resultParam) {
            try {
                const decodedStr = decodeURIComponent(atob(resultParam));
                const sharedData = JSON.parse(decodedStr);
                showResult(sharedData);
                window.history.replaceState({}, document.title, window.location.pathname);
            } catch (e) {
                console.error("Link tidak valid", e);
            }
        }
    };
