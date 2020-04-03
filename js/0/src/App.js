import React from 'react';
import './App.css';

const Container = ({children}) =>
    <div className="container">
        {children}
    </div>

const Header = ({children}) =>
    <div className="main_header text_on_background">
        <Container>
            {children}
        </Container>
    </div>

const NavBar = ({children}) =>
    <nav className="navigation_bar">
        <a href="/" className="burger">
            <span></span>
        </a>
        {children}
    </nav>

const NavList = ({children}) =>
    <ul className="nav_list">
        {children}
    </ul>

const NavLi = ({children, item_name}) =>
    <li className="li_nav">
        <a href="/">{item_name}</a>
        {children}
    </li>

const NavBtn = ({children}) =>
    <ul className="nav_btn">
        {children}
    </ul>

const NavBtnLi = ({children}) =>
    <li className="li_nav_btn">
        <a href="/">
        {children}</a>
    </li>

const MainLogo = () =>
    <h2 className="main_logo">
        <a href="/">MoGo</a>
    </h2>

const Icon = ({icon_name}) =>
    <span className={`icon-${icon_name}`}>
    </span>

const Banner = ({children}) =>
    <div className="banner orange_gradient text_on_background"
        style={{
            backgroundImage: "url(" + "images/banner-image-1.jpg" + ")",
        }}>
        <Container>
        {children}
        </Container>
    </div>

const Services = ({children}) =>
    <div className="services">
        <Container>
            {children}
        </Container>
    </div>

const CursiveHeader = ({cursive_text, strong_text}) =>
    <h2 className="underline">
        <span className="cursive">{cursive_text}</span>
        {strong_text}
    </h2>

const ServicesItem = ({children}) =>
    <div className="services_item">
        {children}
    </div>

const ServicesText = ({children, item_name, item_text}) =>
    <div className="services-text">
        <h3>{item_name}</h3>
        <p>{item_text}</p>
        {children}
    </div>

const FactItem = ({fact_number, item_text}) =>
    <div className="facts_item">
        <h2 className="number">{fact_number}</h2>
        <h3>{item_text}</h3>
    </div>

const Facts = ({children}) =>
    <div className="facts text_on_background">
        <div className="facts_wrapper container">
            {children}
        </div>
    </div>

const Team = ({children}) =>
    <div className="team container">
        {children}
    </div>

const TeamText = ({item_name, item_position}) =>
    <>
        <h3>{item_name}</h3>
        <p>{item_position}</p>
    </>

const TeamShare = ({soc_net_name}) =>
    <a href="/" className="team_share_a">
        <Icon icon_name={soc_net_name}/>
    </a>

const TeamShareGroup = () =>
    <div className="team_share text_on_background">
        <TeamShare soc_net_name="facebook" />
        <TeamShare soc_net_name="twitter" />
        <TeamShare soc_net_name="pinterest" />
        <TeamShare soc_net_name="instagram" />
    </div>

const TeamPic = ({item_pic}) =>
    <div className="team_img orange_gradient">
        <img src={`images/${item_pic}.jpg`} alt={item_pic}/>
        <TeamShareGroup />
    </div>

const TeamItem = ({children}) =>
    <div className="team_item">
        {children}
    </div>

const ParthnerItem = ({item_pic}) =>
    <li className="parthners_item">
        <img src={`images/${item_pic}.png`} alt={item_pic}/>
    </li>

const Parthners = ({children}) =>
    <div className="parthners">
        <ul className="parthners_wrapper container">
            {children}
        </ul>
    </div>

const About = ({children}) =>
    <div className="about container">
        {children}
    </div>

const GalleryItem = ({item_pic}) =>
    <div className="gallery_item">
        <div className="gallery_img orange_gradient">
            <img src={`images/${item_pic}.jpg`} alt={item_pic} />
            <div className="gallery_img_describe text_on_background">
                <Icon icon_name="picture"/>
                <h3>creatively designed</h3>
                <p className="subheadline">Lorem ipsum dolor sit</p>
            </div>
        </div>
    </div>

const GalleryColumn = ({children}) =>
    <div className="gallery_column">
        {children}
    </div>

const Gallery = ({children}) =>
    <div className="gallery_wrapper">
        {children}
    </div>

const TestimonialItem = ({item_pic, item_text, item_author}) =>
    <div className="testimonial_item">
        <img className="photo_author" src={`images/${item_pic}.jpg`} alt={item_pic} />
            <blockquote className="testimonial_text">
                <p className="testimonial_quote">“{item_text}”</p>
                <cite className="testimonial_author underline">{item_author}</cite>
            </blockquote>
    </div>

const Testimonial = ({children}) =>
    <div className="testimonial_wrapper container">
        {children}
    </div>

const ClientItem = ({item_pic, item_text, item_author, item_position}) =>
    <div className="clients_item">
        <img src={`images/${item_pic}.jpg`} alt={item_pic} className="clients_img" />
        <div className="clients_text">
            <h3>{item_author}</h3>
            <p className="subheadline underline">{item_position}</p>
            <p>{item_text}</p>
        </div>
    </div>

const Clients = ({children}) =>
    <div className="clients"
         style={{
             backgroundImage: "url(" + "images/clients_banner.jpg" + ")",
         }}>
        <Container>
            {children}
        </Container>
    </div>

const StoryPic = ({item_pic, date_time, day, month}) =>
        <div className="stories_img">
            <img src={`images/${item_pic}.jpg`} alt={item_pic} />
                <div className="story_date text_on_background">
                    <time dateTime={`${date_time}`}></time>
                    <h2>{day}</h2>
                    <p className="subheadline">{month}</p>
                </div>
        </div>

const StoryBeginning = ({item_name, item_text}) =>
        <div className="story_text">
            <h3>{item_name}</h3>
            <p>{item_text}</p>
        </div>

const StoryCounter = ({view_count, comment_count}) =>
        <div className="viewing_count">
            <p className="subheadline">
                <Icon icon_name="view"/>
                {view_count}
            </p>
            <p className="subheadline">
                <Icon icon_name="speech_bubble"/>
                {comment_count}
            </p>
        </div>

const StoryItem = ({children}) =>
    <div className="stories_item">
        {children}
    </div>

const Stories = ({children}) =>
    <div className="stories container">
        {children}
    </div>

const Footer = ({children}) =>
    <div className="main_footer">
        <Container>
            {children}
        </Container>
    </div>

const Contacts = ({children}) =>
    <div className="contacts">
        {children}
    </div>

const FollowLi = ({children}) =>
    <li>
        <a href="/">
            {children}
        </a>
    </li>

const FBlogItem = ({item_pic, item_text, date_time, item_date}) =>
    <div className="f_blog_item">
        <img src={`images/${item_pic}.jpg`} alt={item_pic} />
            <div className="f_blog_text">
                <h4>{item_text}</h4>
                <p className="footer_subheadline">
                    <time dateTime={`${date_time}`}>{item_date}</time>
                </p>
            </div>
    </div>

const FooterBlog = ({children}) =>
    <div className="footer_blogs">
        {children}
    </div>

const InstagramItem = ({item_pic}) =>
    <div className="instagram_item">
        <a href="/"><img src={`images/${item_pic}.jpg`} alt={item_pic} /></a>
    </div>

const Instagram = ({children}) =>
    <div className="footer_instagram">
        {children}
    </div>



function App() {
  return (
      <div className="App">
          <div className="wrapper">
              <Header>
                  <div className="inner_wrapper_nav">
                      <MainLogo></MainLogo>
                      <NavBar>
                              <NavList>
                                  <NavLi item_name="About" />
                                  <NavLi item_name="service" />
                                  <NavLi item_name="work" />
                                  <NavLi item_name="blog" />
                                  <NavLi item_name="contact" />
                              </NavList>
                              {/* shopping and search buttons */}
                              <NavBtn>
                                  <NavBtnLi>
                                      <Icon icon_name="shopping_cart" />
                                  </NavBtnLi>
                                  <NavBtnLi>
                                      <Icon icon_name="search" />
                                  </NavBtnLi>
                              </NavBtn>
                          </NavBar>
                  </div>
              </Header>
              <main>
                  <Banner>
                      <div className="banner_text">
                          <h1 className="underline"><span className="cursive c_text__banner">Creative Template</span>
                              Welcome to&nbsp;MoGo</h1>
                          <h3><a href="/" className="a_more">Learn more</a></h3>
                      </div>
                  </Banner>
                  <Services>
                      <CursiveHeader cursive_text='We work with' strong_text='Amazing Service'/>
                      <div className="services_wrapper">
                          <ServicesItem>
                              <Icon icon_name="alarm"/>
                              <ServicesText item_name="Photography" item_text="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor." />
                          </ServicesItem>

                          <ServicesItem>
                              <Icon icon_name="graph"/>
                              <ServicesText item_name="Web Design" item_text="Ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor." />
                          </ServicesItem>

                          <ServicesItem>
                              <Icon icon_name="computer_ok"/>
                              <ServicesText item_name="Creativity" item_text="Dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor." />
                          </ServicesItem>

                          <ServicesItem>
                              <Icon icon_name="book"/>
                              <ServicesText item_name="SEO" item_text="Ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod." />
                          </ServicesItem>

                          <ServicesItem>
                              <Icon icon_name="home"/>
                              <ServicesText item_name="Css/Html" item_text="Lorem dolor sit amet, consectetur adipiscing elit, sed do tempor." />
                          </ServicesItem>

                          <ServicesItem>
                              <Icon icon_name="image"/>
                              <ServicesText item_name="digital" item_text="Sit amet, consectetur adipiscing elit, sed do eiusmod tempor." />
                          </ServicesItem>
                      </div>
                  </Services>
                  <Facts>
                      <FactItem fact_number="42" item_text="Web Design Projects" />
                      <FactItem fact_number="123" item_text="happy clients" />
                      <FactItem fact_number="15" item_text="award winner" />
                      <FactItem fact_number="99" item_text="cup of coffee" />
                      <FactItem fact_number="24" item_text="members" />
                  </Facts>
                  <Team>
                      <CursiveHeader cursive_text='Who we are' strong_text='Meet our team'/>
                      <p className="lead">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
                          incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
                          exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. </p>
                      <div className="team_wrapper">
                          <TeamItem>
                              <TeamPic item_pic='team_1'/>
                              <TeamText item_name='Matthew Dix' item_position='Graphic Design'/>
                          </TeamItem>

                          <TeamItem>
                              <TeamPic item_pic='team_2'/>
                              <TeamText item_name='Christopher Campbell' item_position='Branding/UX design'/>
                          </TeamItem>

                          <TeamItem>
                              <TeamPic item_pic='team_3'/>
                              <TeamText item_name='Michael Fertig' item_position='Developer'/>
                          </TeamItem>
                      </div>
                  </Team>
                  <Parthners>
                      <ParthnerItem item_pic='partner-logo-1'/>
                      <ParthnerItem item_pic='partner-logo-2'/>
                      <ParthnerItem item_pic='partner-logo-3'/>
                      <ParthnerItem item_pic='partner-logo-4'/>
                      <ParthnerItem item_pic='partner-logo-5'/>
                      <ParthnerItem item_pic='partner-logo-6'/>
                  </Parthners>
                  <About>
                      <CursiveHeader cursive_text='What we do' strong_text='some of our work'/>
                      <p className="lead">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
                          incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
                          exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. </p>
                  </About>
                  <Gallery>
                      <GalleryColumn>
                          <GalleryItem item_pic="work_pic1"/>
                          <GalleryItem item_pic="work_pic2"/>
                      </GalleryColumn>
                      <GalleryColumn>
                          <GalleryItem item_pic="work_pic3"/>
                          <GalleryItem item_pic="work_pic4"/>
                      </GalleryColumn>
                      <GalleryColumn>
                          <GalleryItem item_pic="work_pic5"/>
                      </GalleryColumn>
                      <GalleryColumn>
                          <GalleryItem item_pic="work_pic6"/>
                          <GalleryItem item_pic="work_pic7"/>
                      </GalleryColumn>
                  </Gallery>
                  <Testimonial>
                      <TestimonialItem item_pic="testimonial_author"
                                       item_text="Lorem ipsum dolor sit amet, consectetur adipiscing
                                      elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
                                      ad minim veniam, quis nostrud exercitation."
                                       item_author="Joshua Earle"/>
                  </Testimonial>
                  <Clients>
                      <CursiveHeader cursive_text='Happy Clients' strong_text='What people say'/>
                      <div className="clients_wrapper">
                          <ClientItem item_pic="client1"
                                      item_author="Matthew Dix"
                                      item_position="Graphic Design"
                                      item_text="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
                                                  tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim."
                          />
                          <ClientItem item_pic="client2"
                                      item_author="Nick Karvounis"
                                      item_position="Graphic Design"
                                      item_text="Sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
                                                  labore et dolore magna aliqua. Ut enim ad minim veniam."
                          />
                          <ClientItem item_pic="client3"
                                      item_author="Jaelynn Castillo"
                                      item_position="Graphic Design"
                                      item_text="Ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
                                                  incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam."
                          />
                          <ClientItem item_pic="client4"
                                      item_author="Mike Petrucci"
                                      item_position="Graphic Design"
                                      item_text="Dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
                                                  incididunt ut labore et dolore magna aliqua. Ut enim ad minim."
                          />
                      </div>
                  </Clients>
                  <Stories>
                      <CursiveHeader cursive_text='Our stories' strong_text='Latest blog'/>
                      <div className="stories_wrapper">
                          <StoryItem>
                              <StoryPic item_pic='blog1' date_time='2016-01-15' day='15' month='Jan'/>
                              <StoryBeginning item_name='Lorem ipsum dolor sit amet' item_text='Consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore
                                      magna aliqua.'/>
                              <StoryCounter view_count='542' comment_count='17'/>
                          </StoryItem>
                          <StoryItem>
                              <StoryPic item_pic='blog2' date_time='2016-01-14' day='14' month='Jan'/>
                              <StoryBeginning item_name='sed do eiusmod tempor' item_text='Adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna
                                      aliqua.'/>
                              <StoryCounter view_count='992' comment_count='42'/>
                          </StoryItem>
                          <StoryItem>
                              <StoryPic item_pic='blog3' date_time='2016-01-12' day='12' month='Jan'/>
                              <StoryBeginning item_name='incididunt ut labore et dolore' item_text='Elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua'/>
                              <StoryCounter view_count='1560' comment_count='98'/>
                          </StoryItem>
                      </div>
                  </Stories>
              </main>
              <Footer>
                  <div className="footer_wrapper">
                      <Contacts>
                          <div className="contacts_text">
                              <h2 className="footer_logo"><a href="#">MoGo</a></h2>
                              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
                                  incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
                                  exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
                              <h3 className="count_followers"><span>15k</span> followers</h3>
                          </div>
                          <div className="follow_us">
                                  <p className="subheadline">Follow Us:</p>
                                  <ul className="follow_list">
                                      <FollowLi><Icon icon_name="facebook" /></FollowLi>
                                      <FollowLi><Icon icon_name="twitter" /></FollowLi>
                                      <FollowLi><Icon icon_name="instagram" /></FollowLi>
                                      <FollowLi><Icon icon_name="pinterest" /></FollowLi>
                                      <FollowLi><Icon icon_name="google_plus" /></FollowLi>
                                      <FollowLi><Icon icon_name="youtube" /></FollowLi>
                                      <FollowLi><Icon icon_name="dribbble" /></FollowLi>
                                      <FollowLi> <Icon icon_name="tumblr" /></FollowLi>
                                  </ul>
                          </div>
                          <div className="subscribe">
                              <form><input type="email" placeholder="Your Email..." className="email_subscribe" /></form>
                                  <button className="subscribe_btn" type="submit">Subscribe</button>
                          </div>
                      </Contacts>
                      <FooterBlog>
                          <h3>Blogs</h3>
                          <div className="f_blog_wrapper">
                              <FBlogItem item_pic="blof_footer1" item_text="Lorem ipsum dolor sit amet, consectetur adipiscing" date_time="2016-01-09" item_date="Jan 9, 2016" />
                              <FBlogItem item_pic="blof_footer2" item_text="Consectetur adipiscing elit, sed do eiusmod tempo" date_time="2016-01-09" item_date="Jan 9, 2016" />
                              <FBlogItem item_pic="blof_footer3" item_text="sed do eiusmod tempor incididunt ut labore" date_time="2016-01-09" item_date="Jan 9, 2016" />
                          </div>
                      </FooterBlog>
                      <Instagram>
                          <h3>Instagram</h3>
                          <div className="instagram_wrapper">
                              <InstagramItem item_pic='instagram1'/>
                              <InstagramItem item_pic='instagram2'/>
                              <InstagramItem item_pic='instagram3'/>
                              <InstagramItem item_pic='instagram4'/>
                              <InstagramItem item_pic='instagram5'/>
                              <InstagramItem item_pic='instagram6'/>
                              <InstagramItem item_pic='instagram7'/>
                              <InstagramItem item_pic='instagram8'/>
                              <InstagramItem item_pic='instagram9'/>
                          </div>
                          <p><a href="/" className="footer_subheadline">View more photos</a></p>
                      </Instagram>
                  </div>
                  <h3 className="copyright">© 2016 MoGo free PSD template by <span>Laaqiq</span></h3>

              </Footer>
          </div>
      </div>
  );
}

export default App;
