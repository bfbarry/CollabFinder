export default function Backdrop(props) {
  /* Gray backdrop for flash messages 
  onClick usually to remove it */
    return <div className='backdrop' 
    onClick={props.onClick}/>;
  }