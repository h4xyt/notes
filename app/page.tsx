import { BlogPosts } from 'app/components/posts';

export default function Page() {
  return (
    <section>
      <h1 className="mb-8 text-2xl font-semibold tracking-tighter">
        Apuntes de ciberseguridad
      </h1>
      <p className="mb-4">
        {`Este es mi espacio personal para recopilar apuntes sobre pentesting y
        seguridad informática. Aquí iré documentando lo que voy aprendiendo,
        desde conceptos básicos hasta técnicas más avanzadas, con el objetivo
        de tener un lugar donde organizar los conocimientos que adquiera.`}
      </p>
      <div className="my-8">
        <BlogPosts />
      </div>
    </section>
  );
};
