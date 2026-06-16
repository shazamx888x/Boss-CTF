/**
 * core.js - Hidden CTF Logic
 * ═══════════════════════════════════════
 * This file contains the core challenge logic
 * and is NOT linked anywhere in the HTML
 * 
 * Players must discover this file through
 * network inspection or directory enumeration
 * 
 * ─── SESSION MANAGEMENT ───
 * Level completion is tracked via sessionStorage
 * and localStorage with validation
 * 
 * ─── HIDDEN FUNCTIONS ───
 * validateSession(level) - Checks if player has completed required levels
 * generatePayload() - Creates XSS payload for Level 3
 * decryptMessage(data) - Decodes hidden messages
 * 
 * ─── SECURITY MEASURES ───
 * Anti-cheat detection
 * Path obfuscation
 * Token validation
 * 
 * ███████████████████████████████████████
 */

(function() {
    'use strict';

    // ─── CONFIGURATION ───
    const CONFIG = {
        // Hidden paths (obfuscated)
        PATHS: {
            L1: '0x7f3.html',
            L2: '4c1p3r.html',
            L3: 'n3xus.html',
            ASSETS: '/assets/',
            VAULT: 'vault.zip'
        },
        
        // Session tokens (encrypted)
        TOKENS: {
            SESSION_KEY: 'BaSe_HeX098765432_1@',
            VAULT_PASSWORD: 'zip',
            FINAL_FLAG: 'picoCTF{MAtr1x_V4ult_Br34ch_2024}'
        },
        
        // Level validation
        LEVELS: {
            L1_COMPLETE: 'ctf_level1',
            L2_COMPLETE: 'ctf_level2',
            L3_COMPLETE: 'ctf_complete'
        }
    };

    // ─── SESSION VALIDATION ───
    function validateSession(level) {
        switch(level) {
            case 1:
                // Level 1 doesn't require previous completion
                return true;
            case 2:
                // Must have completed Level 1
                return localStorage.getItem(CONFIG.LEVELS.L1_COMPLETE) === 'true';
            case 3:
                // Must have completed Levels 1 and 2
                return localStorage.getItem(CONFIG.LEVELS.L1_COMPLETE) === 'true' && 
                       localStorage.getItem(CONFIG.LEVELS.L2_COMPLETE) === 'true';
            default:
                return false;
        }
    }

    // ─── XSS PAYLOAD GENERATOR ───
    function generatePayload() {
        // This is the payload that creates the popup with the vault path
        return `(function(){
            const p=document.createElement('div');
            p.style.cssText='position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:#111;color:#0f0;padding:30px;border:2px solid #0f0;font-family:monospace;z-index:999999;text-align:center;box-shadow:0 0 50px rgba(0,255,0,0.3);min-width:300px;';
            p.innerHTML='<h3 style="margin-bottom:15px;">▶ ACCESS GRANTED</h3><p style="margin-bottom:15px;font-size:13px;">Vault path discovered</p><div style="background:#000;padding:10px;margin:10px 0;border:1px solid #0f0;font-size:11px;word-break:break-all;">/assets/vault.zip</div><p style="font-size:11px;opacity:0.5;margin:10px 0;">Password: Check file extension type</p><button onclick="this.parentElement.remove()" style="background:#0f0;color:#000;border:none;padding:10px 30px;font-family:monospace;cursor:pointer;font-weight:bold;margin-top:10px;">CONTINUE</button>';
            document.body.appendChild(p);
        })()`;
    }

    // ─── DECRYPTION FUNCTIONS ───
    function decryptMessage(encoded) {
        try {
            // Simple XOR decryption
            let decoded = '';
            const key = 0x5A;
            for (let i = 0; i < encoded.length; i++) {
                decoded += String.fromCharCode(encoded.charCodeAt(i) ^ key);
            }
            return decoded;
        } catch(e) {
            return null;
        }
    }

    function decodeBase64(str) {
        try {
            return atob(str);
        } catch(e) {
            return null;
        }
    }

    // ─── ANTI-CHEAT DETECTION ───
    function detectCheats() {
        const cheats = [];
        
        // Check for devtools
        const devtools = /./;
        devtools.toString = function() {
            cheats.push('DevTools detected');
            return '';
        };
        
        // Check for console overrides
        if (window.console && window.console.log !== console.log) {
            cheats.push('Console overridden');
        }
        
        // Check for source viewing attempts
        if (document.documentElement.innerHTML.includes('view-source:')) {
            cheats.push('Source view detected');
        }
        
        return cheats;
    }

    // ─── HIDDEN NAVIGATION ───
    function navigateTo(level) {
        const paths = {
            1: CONFIG.PATHS.L1,
            2: CONFIG.PATHS.L2,
            3: CONFIG.PATHS.L3
        };
        
        if (validateSession(level)) {
            window.location.href = paths[level];
        } else {
            // Redirect to appropriate level
            if (level === 2) {
                window.location.href = CONFIG.PATHS.L1;
            } else if (level === 3) {
                window.location.href = CONFIG.PATHS.L2;
            }
        }
    }

    // ─── VAULT ACCESS ───
    function unlockVault(password) {
        if (password === CONFIG.TOKENS.VAULT_PASSWORD) {
            // Show flag
            const flagContainer = document.getElementById('flag-container');
            if (flagContainer) {
                flagContainer.style.display = 'block';
                const flagText = flagContainer.querySelector('.flag-text');
                if (flagText) {
                    flagText.textContent = CONFIG.TOKENS.FINAL_FLAG;
                }
                localStorage.setItem(CONFIG.LEVELS.L3_COMPLETE, 'true');
            }
            return true;
        }
        return false;
    }

    // ─── XSS PAYLOAD PROCESSOR ───
    function processXSS(input) {
        // Check for common XSS patterns
        const patterns = [
            /<script/i,
            /on\w+\s*=/i,
            /javascript:/i,
            /alert\s*\(/i,
            /confirm\s*\(/i,
            /prompt\s*\(/i,
            /document\./i,
            /window\./i,
            /eval\s*\(/i,
            /setTimeout\s*\(/i,
            /setInterval\s*\(/i
        ];
        
        for (let pattern of patterns) {
            if (pattern.test(input)) {
                // XSS detected - trigger the payload
                const payload = generatePayload();
                // Execute the payload
                try {
                    eval(payload);
                } catch(e) {
                    // Silent fail
                }
                return true;
            }
        }
        return false;
    }

    // ─── HIDDEN CONSOLE MESSAGES ───
    function showHiddenHints() {
        const messages = [
            '%c🔍 Welcome to the Matrix CTF',
            '%c💡 The path is hidden in plain sight',
            '%c🔑 Some keys require decryption',
            '%c⚠️ Not everything is as it seems',
            '%c📁 Check file metadata for hidden clues'
        ];
        
        messages.forEach((msg, index) => {
            setTimeout(() => {
                console.log(msg, 'color: #00ff41; font-size: 14px;');
            }, index * 1000);
        });
    }

    // ─── INITIALIZATION ───
    function init() {
        // Run anti-cheat check
        const cheats = detectCheats();
        if (cheats.length > 0) {
            // Log but don't alert - just track
            console.warn('⚠️ Potential cheating detected:', cheats.join(', '));
        }
        
        // Show hidden hints after delay
        setTimeout(showHiddenHints, 3000);
        
        // Check for unfinished sessions
        const level1 = localStorage.getItem(CONFIG.LEVELS.L1_COMPLETE);
        const level2 = localStorage.getItem(CONFIG.LEVELS.L2_COMPLETE);
        
        // Validate session integrity
        if (level2 === 'true' && level1 !== 'true') {
            // Inconsistent state - reset
            localStorage.removeItem(CONFIG.LEVELS.L2_COMPLETE);
            localStorage.removeItem(CONFIG.LEVELS.L3_COMPLETE);
            console.warn('⚠️ Session state repaired');
        }
        
        // Generate random ID for tracking
        if (!sessionStorage.getItem('ctf_session_id')) {
            sessionStorage.setItem('ctf_session_id', 
                Math.random().toString(36).substring(2, 15) + 
                Math.random().toString(36).substring(2, 15)
            );
        }
    }

    // ─── EXPOSE PUBLIC FUNCTIONS ───
    window.CTF = {
        validateSession: validateSession,
        navigateTo: navigateTo,
        unlockVault: unlockVault,
        processXSS: processXSS,
        decryptMessage: decryptMessage,
        decodeBase64: decodeBase64,
        CONFIG: CONFIG
    };

    // ─── HIDDEN EVENT LISTENERS ───
    document.addEventListener('DOMContentLoaded', init);
    
    // Monitor for page changes
    document.addEventListener('visibilitychange', function() {
        if (document.hidden) {
            // User switched tabs - possible cheating attempt
            console.log('⚠️ Tab switch detected');
        }
    });

    // ─── SELF-DESTRUCT SEQUENCE ───
    // If the file is accessed directly, self-destruct
    if (window.location.pathname.includes('core.js')) {
        console.log('%c⚠️ This file is meant to be discovered, not directly accessed.', 'color: #ff4444; font-size: 16px;');
        console.log('%c🔍 Search for the hidden path in the source code.', 'color: #00ff41; font-size: 14px;');
    }

    console.log('%c📦 Core module loaded.', 'color: #00ff41; font-size: 10px;');
})();
