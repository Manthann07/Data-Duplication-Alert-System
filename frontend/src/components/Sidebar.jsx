import { FaDatabase, FaUpload } from 'react-icons/fa';

{/* Add these items to your navigation links array or list */}
{
  name: 'Data Repository',
  icon: <FaDatabase className="w-5 h-5" />,
  href: '/repository',
  current: pathname === '/repository'
},
{
  name: 'Upload Dataset',
  icon: <FaUpload className="w-5 h-5" />,
  href: '/upload',
  current: pathname === '/upload'
}, 