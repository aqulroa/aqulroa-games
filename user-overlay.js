document.addEventListener('DOMContentLoaded', () => {
    fetch('/api/me')
        .then(res => {
            if (!res.ok) {
                // If not authenticated, the server should redirect, but just in case:
                window.location.href = '/';
            }
            return res.json();
        })
        .then(user => {
            if (!user || !user.username) return;

            // Create container
            const container = document.createElement('div');
            container.style.position = 'fixed';
            container.style.top = '15px';
            container.style.right = '20px';
            container.style.zIndex = '999999';
            container.style.display = 'flex';
            container.style.alignItems = 'center';
            container.style.gap = '10px';
            container.style.fontFamily = '"Poppins", sans-serif';
            container.style.background = 'rgba(0, 0, 0, 0.6)';
            container.style.padding = '8px 16px';
            container.style.borderRadius = '30px';
            container.style.backdropFilter = 'blur(10px)';
            container.style.border = `1px solid ${user.color}40`;
            container.style.boxShadow = `0 4px 15px rgba(0,0,0,0.3), inset 0 0 10px ${user.color}20`;
            container.style.color = '#fff';
            container.style.userSelect = 'none';

            // Prefix
            const prefix = document.createElement('span');
            prefix.innerText = `[${user.prefix}]`;
            prefix.style.color = user.color;
            prefix.style.fontWeight = '800';
            prefix.style.textShadow = user.glow;
            prefix.style.letterSpacing = '1px';

            // Username
            const username = document.createElement('span');
            username.innerText = user.username;
            username.style.fontWeight = '500';
            username.style.fontSize = '14px';
            
            // Logout button
            const logout = document.createElement('button');
            logout.innerText = '⏻'; // Power icon
            logout.title = 'Выйти';
            logout.style.background = 'transparent';
            logout.style.border = 'none';
            logout.style.color = '#ff4444';
            logout.style.cursor = 'pointer';
            logout.style.fontSize = '16px';
            logout.style.marginLeft = '5px';
            logout.style.padding = '0';
            logout.style.transition = 'transform 0.2s, text-shadow 0.2s';
            
            logout.onmouseover = () => {
                logout.style.transform = 'scale(1.2)';
                logout.style.textShadow = '0 0 8px #ff4444';
            };
            logout.onmouseout = () => {
                logout.style.transform = 'scale(1)';
                logout.style.textShadow = 'none';
            };

            logout.onclick = async () => {
                await fetch('/api/logout', { method: 'POST' });
                window.location.href = '/';
            };

            container.appendChild(prefix);
            container.appendChild(username);
            container.appendChild(logout);

            document.body.appendChild(container);
        })
        .catch(err => console.error('Failed to fetch user:', err));
});
