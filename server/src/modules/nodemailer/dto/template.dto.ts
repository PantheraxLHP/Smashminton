export const generateSimpleCredentialsTemplate = (username: string, password: string): string => {
    return `
    <!DOCTYPE html>
    <html lang="vi">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Thông tin đăng nhập - Smashminton</title>
        <style>
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }
            
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                min-height: 100vh;
                padding: 20px;
                line-height: 1.6;
            }
            
            .email-container {
                max-width: 600px;
                margin: 0 auto;
                background: white;
                border-radius: 20px;
                overflow: hidden;
                box-shadow: 0 20px 40px rgba(0,0,0,0.1);
            }
            
            .header {
                background: linear-gradient(135deg, #27ae60 0%, #2ecc71 50%, #55a3ff 100%);
                padding: 40px 30px;
                text-align: center;
                position: relative;
                overflow: hidden;
            }
            
            .header::before {
                content: '';
                position: absolute;
                top: -50%;
                left: -50%;
                width: 200%;
                height: 200%;
                background-image: 
                    radial-gradient(circle at 20% 80%, rgba(255,255,255,0.1) 0%, transparent 50%),
                    radial-gradient(circle at 80% 20%, rgba(255,255,255,0.1) 0%, transparent 50%);
                animation: float 6s ease-in-out infinite;
            }
            
            @keyframes float {
                0%, 100% { transform: translateY(0px); }
                50% { transform: translateY(-10px); }
            }
            
            .logo {
                font-size: 2.5em;
                font-weight: bold;
                color: white;
                margin-bottom: 10px;
                text-shadow: 0 2px 4px rgba(0,0,0,0.3);
                position: relative;
                z-index: 1;
            }
            
            .tagline {
                color: rgba(255,255,255,0.9);
                font-size: 1.1em;
                position: relative;
                z-index: 1;
            }
            
            .content {
                padding: 40px 30px;
                background: white;
            }
            
            .welcome-text {
                font-size: 1.2em;
                color: #2c3e50;
                margin-bottom: 30px;
                text-align: center;
            }
            
            .credentials-card {
                background: linear-gradient(145deg, #f8f9ff 0%, #e8eaff 100%);
                border-radius: 15px;
                padding: 30px;
                margin: 30px 0;
                box-shadow: 
                    inset 0 1px 0 rgba(255,255,255,0.6),
                    0 8px 25px rgba(102, 126, 234, 0.1);
                border: 2px solid rgba(102, 126, 234, 0.1);
            }
            
            .credentials-title {
                font-size: 1.3em;
                color: #4c6ef5;
                margin-bottom: 25px;
                text-align: center;
                font-weight: 600;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 10px;
            }
            
            .field {
                margin: 20px 0;
                background: white;
                border-radius: 12px;
                padding: 20px;
                box-shadow: 0 4px 15px rgba(0,0,0,0.05);
                border-left: 5px solid #ff6b6b;
                transition: transform 0.2s ease, box-shadow 0.2s ease;
            }
            
            .field:hover {
                transform: translateY(-2px);
                box-shadow: 0 8px 25px rgba(0,0,0,0.1);
            }
            
            .label {
                font-weight: 600;
                color: #495057;
                font-size: 0.9em;
                text-transform: uppercase;
                letter-spacing: 1px;
                margin-bottom: 8px;
                display: flex;
                align-items: center;
                gap: 8px;
            }
            
            .value {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 15px 20px;
                border-radius: 8px;
                font-family: 'Courier New', monospace;
                font-size: 1.1em;
                font-weight: bold;
                letter-spacing: 1px;
                text-align: center;
                box-shadow: inset 0 2px 4px rgba(0,0,0,0.1);
                user-select: all;
                cursor: pointer;
                transition: all 0.3s ease;
            }
            
            .value:hover {
                background: linear-gradient(135deg, #764ba2 0%, #667eea 100%);
                transform: scale(1.02);
            }
            
            .security-note {
                background: linear-gradient(135deg, #ffeaa7 0%, #fdcb6e 100%);
                border-radius: 12px;
                padding: 20px;
                margin: 30px 0;
                border-left: 5px solid #e17055;
                color: #2d3436;
            }
            
            .security-note strong {
                color: #e17055;
                font-size: 1.1em;
            }
            
            .icon {
                font-size: 1.2em;
            }
            
            .footer {
                background: #2c3e50;
                color: white;
                text-align: center;
                padding: 30px;
                position: relative;
            }
            
            .footer::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                height: 3px;
                background: linear-gradient(90deg, #ff6b6b, #ffa726, #ff6b6b);
            }
            
            .company-name {
                font-size: 1.2em;
                font-weight: bold;
                margin-bottom: 10px;
            }
            
            .contact-info {
                opacity: 0.8;
                font-size: 0.9em;
                margin-top: 15px;
            }
            
            .divider {
                height: 2px;
                background: linear-gradient(90deg, transparent, #ff6b6b, transparent);
                margin: 30px 0;
                border-radius: 2px;
            }
            
            @media (max-width: 600px) {
                .email-container {
                    margin: 10px;
                    border-radius: 15px;
                }
                
                .header, .content, .footer {
                    padding: 25px 20px;
                }
                
                .logo {
                    font-size: 2em;
                }
                
                .credentials-card {
                    padding: 20px;
                }
            }
        </style>
    </head>
    <body>
        <div class="email-container">
            <div class="header">
                <div class="logo">🏸 SMASHMINTON</div>
                <div class="tagline">Badminton Management System</div>
            </div>
            
            <div class="content">
                <div class="welcome-text">
                    <strong>Chào mừng bạn đến với hệ thống quản lý!</strong><br>
                    Dưới đây là thông tin đăng nhập của bạn
                </div>
                
                <div class="credentials-card">
                    <div class="credentials-title">
                        <span class="icon">🔐</span>
                        Thông tin đăng nhập
                    </div>
                    
                    <div class="field">
                        <div class="label">
                            <span class="icon">👤</span>
                            Tên đăng nhập
                        </div>
                        <div class="value">${username}</div>
                    </div>
                    
                    <div class="field">
                        <div class="label">
                            <span class="icon">🔑</span>
                            Mật khẩu
                        </div>
                        <div class="value">${password}</div>
                    </div>
                </div>
                
                <div class="divider"></div>
                
                <div class="security-note">
                    <strong>⚠️ Lưu ý bảo mật quan trọng:</strong><br>
                    • Vui lòng đổi mật khẩu ngay sau lần đăng nhập đầu tiên<br>
                    • Không chia sẻ thông tin đăng nhập với bất kỳ ai<br>
                    • Luôn đăng xuất sau khi sử dụng xong<br>
                    • Liên hệ IT nếu gặp vấn đề đăng nhập
                </div>
            </div>
            
            <div class="footer">
                <div class="company-name">🏸 Smashminton Management</div>
                <div>Hệ thống quản lý câu lạc bộ cầu lông chuyên nghiệp</div>
                <div class="contact-info">
                    📧 support@smashminton.com | 📞 1900-xxxx<br>
                    <em>Email tự động - Vui lòng không trả lời</em>
                </div>
            </div>
        </div>
    </body>
    </html>
    `;
};