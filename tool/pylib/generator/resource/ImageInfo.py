#!/usr/bin/env python

################################################################################
#
#  qooxdoo - the new era of web development
#
#  http://qooxdoo.org
#
#  Copyright:
#    2006-2010 1&1 Internet AG, Germany, http://www.1und1.de
#
#  License:
#    LGPL: http://www.gnu.org/licenses/lgpl.html
#    EPL: http://www.eclipse.org/org/documents/epl-v10.php
#    See the LICENSE file in the project's top-level directory for details.
#
#  Authors:
#    * Thomas Herchenroeder (thron7)
#
################################################################################

import re, os, sys, types

from misc import filetool, Path, json
from misc.imginfo import ImgInfo
from generator import Context

class ImgInfoFmt(object):
    "Class to hide image meta info encoding"
    def __init__(self, *arrspec, **kwspec):
        self.width = self.height = self.type = self.mappedId = self.left = self.top = None
        # this part of the constructor supports the img format as used in the 
        # .meta files: [width, height, type [, mapped, off-x, off-y]]
        if arrspec:
            # if the constructor is called with positional arguments, these will be only one,
            # which is an array
            serialspec = arrspec[0]
            self.width     = serialspec[0]
            self.height    = serialspec[1]
            self.type      = serialspec[2]
            # see if this is part of a combined image
            if len(serialspec)>3:
                self.mappedId = serialspec[3]
                self.left      = serialspec[4]
                self.top       = serialspec[5]
            # but init those members anyway, so they are not undefined
            else:
                self.mappedId  = None
                self.left      = None
                self.top       = None
        # if there are (additional) keyword args, use them
        if kwspec:
            self.__init_kw(self, **kwspec)

    def __init_kw(self,**kwspec):
        for kw in kwspec:
            if kw == 'width':
                self.width = kwspec[kw]
            elif kw == 'height':
                self.height = kwspec[kw]
            elif kw == 'type':
                self.type = kwspec[kw]
            elif kw == 'mappedId':
                self.mappedId = kwspec[kw]
            elif kw == 'left':
                self.left = kwspec[kw]
            elif kw == 'top':
                self.top = kwspec[kw]
            elif kw == 'lib':
                self.lib = kwspec[kw]
            else:
                raise NameError, "No such object member: %s" % kw

    def meta_format(self):
        # return data suitable for .meta file
        a = [self.width, self.height, self.type]
        if self.mappedId:
            a.extend([self.mappedId, self.left, self.top])
        return a

