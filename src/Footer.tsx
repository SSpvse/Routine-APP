
const Footer = () => {
    const date = new Date();

    return (
        <footer> {date.toDateString()} </footer>
    );
};

export default Footer;
