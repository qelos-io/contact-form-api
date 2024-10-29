import {addEndpoint, getSdk} from '@qelos/plugin-play'

addEndpoint('/api/contact', {
  method: 'POST',
  verifyToken: false,
  async handler(req, res) {

    const ip = req.ip;
    const userAgent = req.headers['user-agent'];
    const { fullName, email, content } = req.body || {} as any;

    if (!(ip && userAgent && fullName?.trim().includes(' ') && content?.trim() && email?.includes('@'))) {
      res.statusCode = 400;
      return {
        message: 'all fields are mandatory'
      };
    }
    try {
      const data = await getSdk().blueprints.entitiesOf('contact_message').create({
        bypassAdmin: false,
        workspace: process.env.WORKSPACE_ID || '66b48dea4072ff00110dbddc',
        metadata: {
          ip,
          user_agent: userAgent,
          full_name: fullName,
          email_address: email,
          message_content: content,
        }
      })
      console.log(data);
      return {
        success: true
      }
    } catch {
      res.statusCode = 500;
      return {
        message: 'something went wrong'
      };
    }
  }
})