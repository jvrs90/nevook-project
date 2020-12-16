import React, { FC } from 'react'
import LinkButton from './link-button';
type JumboProps = {
    image: string;
    title: string;
};

const sectionStyle = {
	backgroundImage:
		'linear-gradient(90deg, rgba(0,0,0,0.6) 35%, rgba(0,0,0,0.1) 100%), url("/static/jbt-container.jpg")',
}

const Jumbotron: FC<JumboProps> = ({image, title}) => {
    return (
        <>
			<section id='Jumbotron'>
				<div
					className='bg-gray-400 bg-center bg-cover py-1'
					style={sectionStyle}
				>
					<div className='container mx-auto flex flex-col justify-center items-start py-8 h-screen-5'>
						<h2 className='text-6xl font-bold text-gray-100 mb-2'> {title} </h2>
						<h3 className="text-4xl font-semibold text-gray-100 mb-1">
							Próximamente:
            			</h3>
						<ul className='text-white text-2xl mb-2'>
							<li>
								Crea tu biblioteca y ordénala con estantes personalizados.
              				</li>
							<li>Accede a nuestro chat.</li>
							<li>Y participa en retos mensuales</li>
						</ul>

						<LinkButton
                            kind='cta'
                            href='/registro'
						>
							Registrarme a Nevook
						</LinkButton>


					</div>
				</div>
			</section>
        </>
    )
}

export default Jumbotron
