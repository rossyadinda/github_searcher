const usernameInput = document.getElementById('usernameInput');
const searchBtn = document.getElementById('searchBtn');
const loadingDiv = document.getElementById('loading');
const errorMsgDiv = document.getElementById('errorMsg');
const profileCard = document.getElementById('profileCard');

// Elemen penampil data profil
const avatarImg = document.getElementById('avatar');
const nameEl = document.getElementById('name');
const usernameEl = document.getElementById('username');
const bioEl = document.getElementById('bio');
const repoCountEl = document.getElementById('repoCount');
const profileLink = document.getElementById('profileLink');

searchBtn.addEventListener('click', fetchGitHubUser);
usernameInput.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        fetchGitHubUser();
    }
});

async function fetchGitHubUser() {
    const username = usernameInput.value.trim();
    
    if (!username) {
        alert('Mohon masukkan username terlebih dahulu!');
        return;
    }

    // 1. Set kondisi awal: Tampilkan loading, sembunyikan error & card sebelumnya
    loadingDiv.classList.remove('hidden');
    errorMsgDiv.classList.add('hidden');
    profileCard.classList.add('hidden');

    try {
        const response = await fetch(`https://api.github.com/users/${username}`);

        // 2. Tangani kondisi jika status 404 (User tidak ditemukan)
        if (response.status === 404) {
            throw new Error('User tidak ditemukan!');
        }

        if (!response.ok) {
            throw new Error('Terjadi kesalahan pada jaringan server.');
        }

        const data = await response.json();

        // 3. Tampilkan data berhasil ke elemen HTML
        avatarImg.src = data.avatar_url;
        nameEl.textContent = data.name ? data.name : 'Nama tidak tersedia';
        usernameEl.textContent = `@${data.login}`;
        bioEl.textContent = data.bio ? data.bio : 'Tidak ada bio.';
        repoCountEl.textContent = data.public_repos;
        profileLink.href = data.html_url;

        // Munculkan kartu profil
        profileCard.classList.remove('hidden');

    } catch (error) {
        // Tampilkan pesan error jika 404 atau kendala lain
        errorMsgDiv.textContent = error.message;
        errorMsgDiv.classList.remove('hidden');
    } finally {
        // Sembunyikan loading setelah proses selesai (baik sukses maupun gagal)
        loadingDiv.classList.add('hidden');
    }
}