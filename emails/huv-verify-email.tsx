import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Section,
  Tailwind,
  Text,
} from '@react-email/components';

interface HuvVerifyEmailProps {
  validationCode?: string;
  userName?: string;
}

const baseUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : 'http://localhost:3000';

export const HuvVerifyEmail = ({
  validationCode = '123456',
  userName = 'Usuario',
}: HuvVerifyEmailProps) => (
  <Html>
    <Head />
    <Tailwind>
      <Body className="bg-gradient-to-br from-blue-50 to-blue-100 font-sans">
        <Container className="bg-white border border-solid border-gray-200 rounded-2xl shadow-xl mt-10 max-w-[600px] mx-auto my-0 py-12 px-8">
          {/* Logo */}
          <Section className="text-center mb-8">
            <div className="flex items-center justify-center gap-1 mb-4">
              <Text className="font-bold text-4xl tracking-tight text-gray-900 m-0 inline-block">
                HUV
              </Text>
              <Text className="text-lg mt-1 text-blue-500 font-bold m-0 inline-block">
                Medical
              </Text>
            </div>
          </Section>

          {/* Icono de email */}
          <Section className="text-center mb-6">
            <div className="mx-auto w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="32" 
                height="32" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="white" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
              </svg>
            </div>
          </Section>

          {/* Título */}
          <Heading className="text-gray-900 text-3xl font-bold text-center mb-4 mt-0">
            ¡Bienvenido a HUV Medical!
          </Heading>

          {/* Saludo */}
          <Text className="text-gray-700 text-base leading-6 mb-6 text-center">
            Hola <strong>{userName}</strong>,
          </Text>

          <Text className="text-gray-700 text-base leading-6 mb-8 text-center px-4">
            Gracias por registrarte. Para activar tu cuenta, por favor ingresa el siguiente código de verificación:
          </Text>

          {/* Código de verificación */}
          <Section className="bg-gray-100 rounded-lg mx-auto mt-8 mb-8 py-6 px-4 max-w-[320px]">
            <Text className="text-blue-500 text-5xl font-bold tracking-[8px] leading-tight py-0 mx-auto my-0 block text-center">
              {validationCode}
            </Text>
          </Section>

          {/* Información adicional */}
          <Text className="text-gray-600 text-sm leading-6 mb-4 text-center px-4">
            Este código expirará en <strong>15 minutos</strong>.
          </Text>

          <Text className="text-gray-600 text-sm leading-6 mb-2 text-center px-4">
            Si no solicitaste este código, puedes ignorar este correo.
          </Text>

          {/* Separador */}
          <Section className="border-t border-gray-200 mt-8 mb-6"></Section>

          {/* Footer */}
          <Text className="text-gray-500 text-xs leading-5 text-center mb-2">
            ¿Necesitas ayuda?{' '}
            <Link
              href="mailto:soporte@huv.com"
              className="text-blue-500 underline"
            >
              Contáctanos
            </Link>
          </Text>

          <Text className="text-gray-400 text-xs leading-5 text-center m-0">
            © 2025 HUV Medical Inc. Todos los derechos reservados.
          </Text>
        </Container>

        {/* Texto de seguridad */}
        <Text className="text-gray-600 text-xs font-medium tracking-wide leading-6 mt-6 text-center uppercase">
          🔒 Correo seguro de HUV Medical
        </Text>
      </Body>
    </Tailwind>
  </Html>
);

HuvVerifyEmail.PreviewProps = {
  validationCode: '123456',
  userName: 'Juan Pérez',
} as HuvVerifyEmailProps;

export default HuvVerifyEmail;
