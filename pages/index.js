// pages/index.js
export async function getServerSideProps(context) {
  return {
    redirect: {
      destination: '/admin/sesiones',
      permanent: false,
    },
  };
}

export default function Home() {
  // This component won't be rendered; redirection happens before this component is displayed.
  return null;
}
