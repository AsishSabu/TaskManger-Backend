import transporter from "./transporter";


const sendMail=async(
    email:string,
    emailSubject:string,
    content:string
)=>{
    try {
        const info = await transporter.sendMail({
          from: 'Task Manager',
          to: email,
          subject: emailSubject,
          html: content,
        });
    
      } catch (error) {
      }
    
}
export default sendMail;