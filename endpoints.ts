import {addEndpoint, getSdk} from '@qelos/plugin-play'

addEndpoint('/api/contact', {
  method: 'POST',
  verifyToken: false,
  async handler(req, res) {

    const ip = req.ip;
    const userAgent = req.headers['user-agent'];

    if (!(ip && userAgent)) {
      res.statusCode = 400;
      return {
        message: 'cannot identify request',
      };
    }

    const { fullName, email, content } = req.body || {} as any;

    if (!(fullName?.trim().includes(' ') && content?.trim() && email?.includes('@'))) {
      res.statusCode = 400;
      return {
        message: 'all fields are mandatory',
      };
    }
    const sdk = getSdk();

    try {
      const user = await sdk.authentication.getLoggedInUser();
      if (!user) {
        throw new Error('user not logged in');
      }
    } catch {
      await sdk.authentication.refreshToken();
    }

    try {
      const data = await sdk.blueprints.entitiesOf('contact_message').create({
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
    } catch (e) {
      console.log(e);
      res.statusCode = 500;
      return {
        message: 'something went wrong'
      };
    }
  }
})